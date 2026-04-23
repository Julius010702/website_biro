'use client'
import { useEffect, useState, useTransition } from 'react'
import { useUploadThing } from '@/lib/uploadthing-client'

import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type StandarPelayanan = {
  id: string
  judul: string
  deskripsi: string | null
  file: string | null
  urutan: number
  aktif: boolean
}

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
            <button
              type="button"
              onClick={() => onChange('')}
              className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
              style={{ background: 'rgba(0,0,0,0.35)' }}
            >✕</button>
          </div>
        )}
      </div>
    </FormField>
  )
}

export default function PelayananInformasiPage() {
  const [list, setList] = useState<StandarPelayanan[]>([])
  const [form, setForm] = useState<Partial<StandarPelayanan> | null>(null)
  const [pending, start] = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/ppid/standar-pelayanan').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.judul) return show('Judul wajib diisi', 'error')
    start(async () => {
      try {
        const method = form.id ? 'PUT' : 'POST'
        await fetch('/api/admin/ppid/standar-pelayanan', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            urutan: form.urutan ? Number(form.urutan) : 0,
            aktif: form.aktif ?? true,
          }),
        })
        show(form.id ? 'Data diperbarui' : 'Data ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/ppid/standar-pelayanan?id=${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />

      <div className="rounded-xl px-4 py-3 text-xs"
        style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', color: '#1565C0' }}>
        <span className="font-bold">ℹ Standar Pelayanan</span> — Data ini ditampilkan di halaman{' '}
        <span className="font-mono">/ppid/pelayanan</span> dan <span className="font-mono">/ppid/maklumat</span>.
      </div>

      <AdminCard>
        <AdminCardHeader
          title="Standar Pelayanan Informasi"
          action={
            <BtnAdd label="Tambah Standar"
              onClick={() => setForm({ aktif: true, urutan: list.length + 1 })} />
          }
        />
        <AdminTable headers={['Urutan', 'Judul', 'Deskripsi', 'File', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada standar pelayanan" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-xs font-bold"
                    style={{ background: '#EFF6FF', color: '#0D47A1' }}>
                    {d.urutan}
                  </span>
                </AdminTd>
                <AdminTd>
                  <p className="font-semibold text-sm" style={{ color: '#0A2342' }}>{d.judul}</p>
                </AdminTd>
                <AdminTd>
                  <p className="text-xs text-slate-500 line-clamp-2 max-w-xs">{d.deskripsi ?? '-'}</p>
                </AdminTd>
                <AdminTd>
                  {d.file
                    ? (
                      <a href={d.file} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold"
                        style={{ color: '#1565C0' }}>
                        📄 Unduh
                      </a>
                    )
                    : <span className="text-slate-300">-</span>}
                </AdminTd>
                <AdminTd><StatusBadge active={d.aktif} /></AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...d })} />
                    <BtnDelete label={d.judul} onConfirm={() => handleDelete(d.id)} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Standar Pelayanan' : 'Tambah Standar Pelayanan'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField label="Judul" required>
                <Input
                  value={form.judul ?? ''}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Deskripsi">
                <Textarea
                  rows={3}
                  value={form.deskripsi ?? ''}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FileUploadField
                value={form.file ?? ''}
                onChange={(file) => setForm({ ...form, file })}
              />
            </div>
            <FormField label="Urutan">
              <Input
                type="number"
                value={form.urutan ?? ''}
                onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })}
              />
            </FormField>
            <div className="flex items-center gap-2 self-end pb-2">
              <input type="checkbox" id="aktif-sp"
                checked={form.aktif ?? true}
                onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-sp" className="text-xs font-semibold"
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