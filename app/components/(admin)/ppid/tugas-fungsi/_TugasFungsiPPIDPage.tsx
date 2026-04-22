'use client'
// app/(admin)/admin/ppid/tugas-fungsi/_TugasFungsiPPIDPage.tsx
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type TugasFungsi = { id: string; judul: string; konten: string; urutan: number }

export default function TugasFungsiPPIDPage() {
  const [list, setList]   = useState<TugasFungsi[]>([])
  const [form, setForm]   = useState<Partial<TugasFungsi> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/ppid/tugas-fungsi').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.judul || !form?.konten) return show('Judul dan konten wajib diisi', 'error')
    start(async () => {
      try {
        const method = form.id ? 'PUT' : 'POST'
        await fetch('/api/admin/ppid/tugas-fungsi', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, urutan: form.urutan ? Number(form.urutan) : 0 }),
        })
        show(form.id ? 'Data diperbarui' : 'Data ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/ppid/tugas-fungsi?id=${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Tugas dan Fungsi PPID" action={<BtnAdd label="Tambah" onClick={() => setForm({ urutan: list.length + 1 })} />} />
        <AdminTable headers={['Urutan', 'Judul', 'Konten (ringkas)', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={4}><EmptyState label="Belum ada data tugas & fungsi" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-xs font-bold" style={{ background: '#EFF6FF', color: '#0D47A1' }}>{d.urutan}</span>
                </AdminTd>
                <AdminTd><p className="font-semibold text-sm" style={{ color: '#0A2342' }}>{d.judul}</p></AdminTd>
                <AdminTd><p className="text-xs text-slate-500 line-clamp-2 max-w-xs">{d.konten}</p></AdminTd>
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
          <AdminCardHeader title={form.id ? 'Edit Tugas/Fungsi' : 'Tambah Tugas/Fungsi'} />
          <div className="p-5 flex flex-col gap-4">
            <FormField label="Judul" required>
              <Input value={form.judul ?? ''} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
            </FormField>
            <FormField label="Konten" required>
              <Textarea rows={4} value={form.konten ?? ''} onChange={(e) => setForm({ ...form, konten: e.target.value })} />
            </FormField>
            <FormField label="Urutan">
              <Input type="number" value={form.urutan ?? ''} onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })} />
            </FormField>
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