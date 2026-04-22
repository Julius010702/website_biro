'use client'
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, EmptyState, useToast,
} from '@/components/admin/AdminUI'
import { upsertTupoksi, deleteTupoksi } from '@/actions/admin'

type Tupoksi = { id: string; judul: string; konten: string; urutan: number }

export default function TupoksiPage() {
  const [list, setList]   = useState<Tupoksi[]>([])
  const [form, setForm]   = useState<Partial<Tupoksi> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/tupoksi').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.judul || !form?.konten) return show('Judul dan konten wajib diisi', 'error')
    start(async () => {
      try {
        await upsertTupoksi({ id: form.id, judul: form.judul!, konten: form.konten!, urutan: form.urutan ?? 0 })
        show(form.id ? 'Tupoksi diperbarui' : 'Tupoksi ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Tugas Pokok & Fungsi"
          action={<BtnAdd label="Tambah" onClick={() => setForm({ urutan: 0 })} />} />
        <AdminTable headers={['No', 'Judul', 'Urutan', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={4}><EmptyState label="Belum ada data" /></td></tr>
            : list.map((t, i) => (
              <AdminTr key={t.id}>
                <AdminTd>{i + 1}</AdminTd>
                <AdminTd>
                  <p className="font-semibold line-clamp-1" style={{ color: '#0A2342' }}>{t.judul}</p>
                  <p className="text-xs line-clamp-2 mt-0.5" style={{ color: '#64748B' }}>{t.konten}</p>
                </AdminTd>
                <AdminTd>{t.urutan}</AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...t })} />
                    <BtnDelete label={t.judul} onConfirm={async () => { await deleteTupoksi(t.id); load() }} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Tupoksi' : 'Tambah Tupoksi'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <FormField label="Judul" required>
              <Input value={form.judul ?? ''} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
            </FormField>
            <FormField label="Urutan">
              <Input type="number" value={form.urutan ?? 0}
                onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Konten" required>
                <Textarea rows={6} value={form.konten ?? ''}
                  onChange={(e) => setForm({ ...form, konten: e.target.value })} />
              </FormField>
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