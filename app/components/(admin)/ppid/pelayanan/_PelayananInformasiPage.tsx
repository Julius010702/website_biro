'use client'
// app/(admin)/admin/ppid/pelayanan/_PelayananInformasiPage.tsx
import { useEffect, useState, useTransition } from 'react'
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

export default function PelayananInformasiPage() {
  const [list, setList]   = useState<StandarPelayanan[]>([])
  const [form, setForm]   = useState<Partial<StandarPelayanan> | null>(null)
  const [pending, start]  = useTransition()
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
          body: JSON.stringify({ ...form, urutan: form.urutan ? Number(form.urutan) : 0, aktif: form.aktif ?? true }),
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

      {/* Tip */}
      <div className="rounded-xl px-4 py-3 text-xs" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', color: '#1565C0' }}>
        <span className="font-bold">ℹ Standar Pelayanan</span> — Data ini ditampilkan di halaman{' '}
        <span className="font-mono">/ppid/pelayanan</span> dan <span className="font-mono">/ppid/maklumat</span>.
      </div>

      <AdminCard>
        <AdminCardHeader
          title="Standar Pelayanan Informasi"
          action={<BtnAdd label="Tambah Standar" onClick={() => setForm({ aktif: true, urutan: list.length + 1 })} />}
        />
        <AdminTable headers={['Urutan', 'Judul', 'Deskripsi', 'File', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada standar pelayanan" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-xs font-bold" style={{ background: '#EFF6FF', color: '#0D47A1' }}>{d.urutan}</span>
                </AdminTd>
                <AdminTd><p className="font-semibold text-sm" style={{ color: '#0A2342' }}>{d.judul}</p></AdminTd>
                <AdminTd><p className="text-xs text-slate-500 line-clamp-2 max-w-xs">{d.deskripsi ?? '-'}</p></AdminTd>
                <AdminTd>
                  {d.file
                    ? <a href={d.file} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: '#1565C0' }}>Unduh</a>
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
                <Input value={form.judul ?? ''} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Deskripsi">
                <Textarea rows={3} value={form.deskripsi ?? ''} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
              </FormField>
            </div>
            <FormField label="URL File">
              <Input value={form.file ?? ''} onChange={(e) => setForm({ ...form, file: e.target.value })} placeholder="https://…" />
            </FormField>
            <FormField label="Urutan">
              <Input type="number" value={form.urutan ?? ''} onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })} />
            </FormField>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="aktif-sp" checked={form.aktif ?? true} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-sp" className="text-xs font-semibold" style={{ color: '#374151' }}>Aktif</label>
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