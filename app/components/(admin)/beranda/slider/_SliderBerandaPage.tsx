'use client'
// app/(admin)/admin/beranda/slider/_SliderBerandaPage.tsx
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type Slider = {
  id: string
  judul: string
  deskripsi: string | null
  gambar: string
  urutan: number
  aktif: boolean
}

export default function SliderBerandaPage() {
  const [list, setList]   = useState<Slider[]>([])
  const [form, setForm]   = useState<Partial<Slider> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/beranda/slider').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.judul || !form?.gambar) return show('Judul dan gambar wajib diisi', 'error')
    start(async () => {
      try {
        const method = form.id ? 'PUT' : 'POST'
        await fetch('/api/admin/beranda/slider', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            urutan: form.urutan ? Number(form.urutan) : 0,
            aktif: form.aktif ?? true,
          }),
        })
        show(form.id ? 'Slider diperbarui' : 'Slider ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/beranda/slider?id=${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader
          title="Slider Beranda"
          action={<BtnAdd label="Tambah Slider" onClick={() => setForm({ aktif: true, urutan: list.length + 1 })} />}
        />
        <AdminTable headers={['Urutan', 'Preview', 'Judul', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={5}><EmptyState label="Belum ada slider" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-xs font-bold"
                    style={{ background: '#EFF6FF', color: '#0D47A1' }}>
                    {d.urutan}
                  </span>
                </AdminTd>
                <AdminTd>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.gambar} alt={d.judul}
                    className="h-12 w-20 object-cover rounded-lg border border-slate-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </AdminTd>
                <AdminTd>
                  <p className="font-semibold text-sm line-clamp-1" style={{ color: '#0A2342' }}>{d.judul}</p>
                  {d.deskripsi && <p className="text-[11px] text-slate-400 line-clamp-1">{d.deskripsi}</p>}
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
          <AdminCardHeader title={form.id ? 'Edit Slider' : 'Tambah Slider Beranda'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField label="Judul" required>
                <Input value={form.judul ?? ''} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="URL Gambar" required>
                <Input value={form.gambar ?? ''} onChange={(e) => setForm({ ...form, gambar: e.target.value })} placeholder="https://…" />
              </FormField>
            </div>
            {form.gambar && (
              <div className="sm:col-span-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.gambar} alt="preview"
                  className="max-h-40 w-full object-cover rounded-xl border border-slate-100 bg-slate-50" />
              </div>
            )}
            <div className="sm:col-span-2">
              <FormField label="Deskripsi">
                <Textarea rows={2} value={form.deskripsi ?? ''} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Urutan">
              <Input type="number" value={form.urutan ?? ''} onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })} />
            </FormField>
            <div className="flex items-center gap-2 self-end pb-2">
              <input type="checkbox" id="aktif-sl" checked={form.aktif ?? true} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-sl" className="text-xs font-semibold" style={{ color: '#374151' }}>Aktif</label>
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