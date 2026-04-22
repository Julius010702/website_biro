'use client'
// app/(admin)/admin/ppid/maklumat/_MaklumatPelayananPage.tsx
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type Maklumat = { id: string; konten: string; gambar: string | null; aktif: boolean }

export default function MaklumatPelayananPage() {
  const [list, setList]   = useState<Maklumat[]>([])
  const [form, setForm]   = useState<Partial<Maklumat> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/ppid/maklumat').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.konten) return show('Konten wajib diisi', 'error')
    start(async () => {
      try {
        const method = form.id ? 'PUT' : 'POST'
        await fetch('/api/admin/ppid/maklumat', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, aktif: form.aktif ?? true }),
        })
        show(form.id ? 'Maklumat diperbarui' : 'Maklumat ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/ppid/maklumat?id=${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />

      {/* Info: hanya 1 yang aktif */}
      <div className="rounded-xl px-4 py-3 text-xs flex items-center gap-2" style={{ background: '#FFFBEB', border: '1px solid #FCD34D', color: '#B45309' }}>
        <span className="font-bold">ℹ</span>
        Hanya satu maklumat yang dapat aktif sekaligus. Maklumat yang aktif akan ditampilkan di halaman publik.
      </div>

      <AdminCard>
        <AdminCardHeader
          title="Maklumat Pelayanan"
          action={<BtnAdd label="Tambah Maklumat" onClick={() => setForm({ aktif: true })} />}
        />
        <AdminTable headers={['Konten (ringkas)', 'Gambar', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={4}><EmptyState label="Belum ada maklumat pelayanan" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <p className="text-xs text-slate-600 line-clamp-3 max-w-sm" dangerouslySetInnerHTML={{ __html: d.konten.substring(0, 200) }} />
                </AdminTd>
                <AdminTd>
                  {d.gambar
                    ? <a href={d.gambar} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: '#1565C0' }}>Lihat</a>
                    : <span className="text-slate-300">-</span>}
                </AdminTd>
                <AdminTd><StatusBadge active={d.aktif} /></AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...d })} />
                    <BtnDelete label="maklumat ini" onConfirm={() => handleDelete(d.id)} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Maklumat' : 'Tambah Maklumat Pelayanan'} />
          <div className="p-5 flex flex-col gap-4">
            <FormField label="Konten Maklumat" required>
              <Textarea
                rows={8}
                value={form.konten ?? ''}
                onChange={(e) => setForm({ ...form, konten: e.target.value })}
                placeholder="Tulis teks maklumat pelayanan… (HTML diperbolehkan)"
              />
            </FormField>
            <FormField label="URL Gambar Maklumat">
              <Input value={form.gambar ?? ''} onChange={(e) => setForm({ ...form, gambar: e.target.value })} placeholder="https://…" />
            </FormField>
            {form.gambar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.gambar} alt="preview" className="max-h-48 rounded-xl object-contain border border-slate-100 bg-slate-50" />
            )}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="aktif-mk" checked={form.aktif ?? true} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-mk" className="text-xs font-semibold" style={{ color: '#374151' }}>Aktif</label>
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