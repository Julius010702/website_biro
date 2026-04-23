'use client'
import { useEffect, useState, useTransition } from 'react'
import { useUploadThing } from '@/lib/uploadthing-client'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, Select, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'
import { upsertDokumenPPID, deleteDokumenPPID } from '@/actions/admin'

type DokumenPPID = {
  id: string; judul: string; kategori: string; tahun: number | null
  file: string | null; deskripsi: string | null; aktif: boolean
}

const KATEGORI_OPTIONS = [
  'REGULASI', 'TUGAS_FUNGSI', 'STRUKTUR_ORGANISASI', 'MAKLUMAT',
  'DOKUMEN_ANGGARAN', 'PROSEDUR_BENCANA', 'SK_DIKECUALIKAN',
  'SK_DAFTAR_INFORMASI', 'DAFTAR_INFORMASI',
]

function FileUploadField({
  value, onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const { startUpload } = useUploadThing('pdfUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) onChange(res[0].ufsUrl)
      setBusy(false)
    },
    onUploadError: (e) => {
      setErr(e.message ?? 'Upload gagal')
      setBusy(false)
    },
  })

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr('')
    setBusy(true)
    await startUpload([file])
    e.target.value = ''
  }

  return (
    <FormField label="File Dokumen" hint="Upload PDF maks 16MB, atau isi URL langsung">
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau upload file PDF"
            className="flex-1"
          />
          <label
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer"
            style={{
              background: busy ? '#F3F4F6' : '#EFF6FF',
              color: busy ? '#9CA3AF' : '#1565C0',
              borderColor: busy ? '#E5E7EB' : '#BFDBFE',
              pointerEvents: busy ? 'none' : 'auto',
            }}
          >
            {busy ? '⏳ Mengupload...' : '📄 Upload PDF'}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFile}
              disabled={busy}
            />
          </label>
        </div>
        {err && <p className="text-xs" style={{ color: '#DC2626' }}>{err}</p>}
        {value && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <span className="text-lg">📄</span>
            <a href={value} target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold flex-1 truncate"
              style={{ color: '#1565C0' }}>
              {value.split('/').pop() ?? 'Lihat File'}
            </a>
            <button type="button" onClick={() => onChange('')}
              className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
              style={{ background: 'rgba(0,0,0,0.35)' }}>✕</button>
          </div>
        )}
      </div>
    </FormField>
  )
}

export default function DokumenPPIDPage() {
  const [list, setList] = useState<DokumenPPID[]>([])
  const [form, setForm] = useState<Partial<DokumenPPID> | null>(null)
  const [pending, start] = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/ppid/dokumen').then((r) => r.json()).then((d) => setList(d))
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/ppid/dokumen').then((r) => r.json()).then((d) => { if (!cancelled) setList(d) })
    return () => { cancelled = true }
  }, [])

  function handleSave() {
    if (!form?.judul || !form?.kategori) return show('Judul dan kategori wajib diisi', 'error')
    start(async () => {
      try {
        await upsertDokumenPPID({
          id: form.id,
          judul: form.judul!,
          kategori: form.kategori as never,
          tahun: form.tahun ? Number(form.tahun) : undefined,
          file: form.file ?? undefined,
          deskripsi: form.deskripsi ?? undefined,
          aktif: form.aktif ?? true,
        })
        show(form.id ? 'Dokumen diperbarui' : 'Dokumen ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader
          title="Dokumen PPID"
          action={<BtnAdd label="Tambah Dokumen" onClick={() => setForm({ aktif: true })} />}
        />
        <AdminTable headers={['Judul', 'Kategori', 'Tahun', 'File', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada dokumen PPID" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <p className="font-semibold line-clamp-1 max-w-xs" style={{ color: '#0A2342' }}>{d.judul}</p>
                </AdminTd>
                <AdminTd>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{ background: '#EFF6FF', color: '#1565C0' }}>
                    {d.kategori.replace(/_/g, ' ')}
                  </span>
                </AdminTd>
                <AdminTd>{d.tahun ?? '-'}</AdminTd>
                <AdminTd>
                  {d.file
                    ? <a href={d.file} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-semibold" style={{ color: '#1565C0' }}>Unduh</a>
                    : <span style={{ color: '#94A3B8' }}>-</span>}
                </AdminTd>
                <AdminTd><StatusBadge active={d.aktif} /></AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...d })} />
                    <BtnDelete label={d.judul}
                      onConfirm={async () => { await deleteDokumenPPID(d.id); load() }} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Dokumen' : 'Tambah Dokumen PPID'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField label="Judul" required>
                <Input
                  value={form.judul ?? ''}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="Kategori" required>
              <Select value={form.kategori ?? ''}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                <option value="">-- Pilih Kategori --</option>
                {KATEGORI_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Tahun">
              <Input
                type="number"
                value={form.tahun ?? ''}
                onChange={(e) => setForm({ ...form, tahun: e.target.value ? Number(e.target.value) : undefined })}
              />
            </FormField>
            <div className="sm:col-span-2">
              <FileUploadField
                value={form.file ?? ''}
                onChange={(file) => setForm({ ...form, file })}
              />
            </div>
            <div className="sm:col-span-2">
              <FormField label="Deskripsi">
                <Textarea
                  value={form.deskripsi ?? ''}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows={2}
                />
              </FormField>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="aktif-ppid"
                checked={form.aktif ?? true}
                onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-ppid" className="text-xs font-semibold"
                style={{ color: '#374151' }}>Aktif</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
            <BtnSecondary onClick={() => setForm(null)}>Batal</BtnSecondary>
            <BtnPrimary onClick={handleSave} loading={pending}>
              {form.id ? 'Simpan' : 'Tambah'}
            </BtnPrimary>
          </div>
        </AdminCard>
      )}
    </div>
  )
}