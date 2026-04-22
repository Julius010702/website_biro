'use client'
// app/(admin)/admin/ppid/prosedur-bencana/_ProsedurBencanaPage.tsx
//
// Mengelola DokumenPPID dengan kategori = PROSEDUR_BENCANA
// Menggunakan kembali actions yang sama dengan DokumenPPIDPage
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'
import { upsertDokumenPPID, deleteDokumenPPID } from '@/actions/admin'

type DokumenPPID = { id: string; judul: string; tahun: number | null; file: string | null; deskripsi: string | null; aktif: boolean }

export default function ProsedurBencanaPage() {
  const [list, setList]   = useState<DokumenPPID[]>([])
  const [form, setForm]   = useState<Partial<DokumenPPID> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/ppid/dokumen?kategori=PROSEDUR_BENCANA').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.judul) return show('Judul wajib diisi', 'error')
    start(async () => {
      try {
        await upsertDokumenPPID({
          id: form.id,
          judul: form.judul!,
          kategori: 'PROSEDUR_BENCANA',
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

      {/* Info konteks */}
      <div className="rounded-xl px-4 py-3 text-xs flex items-start gap-2" style={{ background: '#FFF7ED', border: '1px solid #FED7AA', color: '#92400E' }}>
        <span className="text-base leading-none mt-0.5">⚠</span>
        <span>Dokumen pada halaman ini ditampilkan di <span className="font-mono font-bold">/ppid/prosedur-bencana</span>.
        Hanya dokumen dengan kategori <span className="font-bold">PROSEDUR_BENCANA</span> yang dikelola di sini.</span>
      </div>

      <AdminCard>
        <AdminCardHeader
          title="Prosedur Peringatan Dini Bencana"
          action={<BtnAdd label="Tambah Dokumen" onClick={() => setForm({ aktif: true })} />}
        />
        <AdminTable headers={['Judul', 'Tahun', 'File', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={5}><EmptyState label="Belum ada dokumen prosedur bencana" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <p className="font-semibold text-sm line-clamp-1 max-w-xs" style={{ color: '#0A2342' }}>{d.judul}</p>
                  {d.deskripsi && <p className="text-[11px] text-slate-400 line-clamp-1">{d.deskripsi}</p>}
                </AdminTd>
                <AdminTd>{d.tahun ?? '-'}</AdminTd>
                <AdminTd>
                  {d.file
                    ? <a href={d.file} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: '#C2410C' }}>Unduh</a>
                    : <span className="text-slate-300">-</span>}
                </AdminTd>
                <AdminTd><StatusBadge active={d.aktif} /></AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...d })} />
                    <BtnDelete label={d.judul} onConfirm={async () => { await deleteDokumenPPID(d.id); load() }} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Dokumen Prosedur' : 'Tambah Dokumen Prosedur Bencana'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField label="Judul Dokumen" required>
                <Input value={form.judul ?? ''} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Tahun">
              <Input type="number" value={form.tahun ?? ''} onChange={(e) => setForm({ ...form, tahun: e.target.value ? Number(e.target.value) : undefined })} />
            </FormField>
            <FormField label="URL File">
              <Input value={form.file ?? ''} onChange={(e) => setForm({ ...form, file: e.target.value })} placeholder="https://…" />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Deskripsi">
                <Textarea rows={2} value={form.deskripsi ?? ''} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
              </FormField>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="aktif-pb" checked={form.aktif ?? true} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-pb" className="text-xs font-semibold" style={{ color: '#374151' }}>Aktif</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
            <BtnSecondary onClick={() => setForm(null)}>Batal</BtnSecondary>
            <BtnPrimary onClick={handleSave} loading={pending}>{form.id ? 'Simpan' : 'Tambah'}</BtnPrimary>
          </div>
        </AdminCard>
      )}
    </div>
  )
}