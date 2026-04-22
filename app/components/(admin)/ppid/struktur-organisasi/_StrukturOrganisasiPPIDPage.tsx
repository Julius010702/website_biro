'use client'
// app/(admin)/admin/ppid/struktur-organisasi/_StrukturOrganisasiPPIDPage.tsx
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type StrukturOrg = { id: string; gambar: string; deskripsi: string | null; aktif: boolean }

export default function StrukturOrganisasiPPIDPage() {
  const [list, setList]   = useState<StrukturOrg[]>([])
  const [form, setForm]   = useState<Partial<StrukturOrg> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/ppid/struktur-organisasi').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.gambar) return show('URL gambar wajib diisi', 'error')
    start(async () => {
      try {
        const method = form.id ? 'PUT' : 'POST'
        await fetch('/api/admin/ppid/struktur-organisasi', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, aktif: form.aktif ?? true }),
        })
        show(form.id ? 'Data diperbarui' : 'Data ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/ppid/struktur-organisasi?id=${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader
          title="Struktur Organisasi PPID"
          action={<BtnAdd label="Tambah Gambar" onClick={() => setForm({ aktif: true })} />}
        />
        <AdminTable headers={['Preview', 'Deskripsi', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={4}><EmptyState label="Belum ada gambar struktur organisasi" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.gambar} alt="struktur" className="h-14 w-24 object-cover rounded-lg border border-slate-100" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </AdminTd>
                <AdminTd><p className="text-xs text-slate-500 line-clamp-2 max-w-xs">{d.deskripsi ?? '-'}</p></AdminTd>
                <AdminTd><StatusBadge active={d.aktif} /></AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...d })} />
                    <BtnDelete label="gambar ini" onConfirm={() => handleDelete(d.id)} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Gambar Struktur' : 'Tambah Gambar Struktur'} />
          <div className="p-5 flex flex-col gap-4">
            <FormField label="URL Gambar" required>
              <Input value={form.gambar ?? ''} onChange={(e) => setForm({ ...form, gambar: e.target.value })} placeholder="https://…" />
            </FormField>
            {form.gambar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.gambar} alt="preview" className="max-h-48 rounded-xl object-contain border border-slate-100 bg-slate-50" />
            )}
            <FormField label="Deskripsi">
              <Textarea rows={2} value={form.deskripsi ?? ''} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
            </FormField>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="aktif-so" checked={form.aktif ?? true} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-so" className="text-xs font-semibold" style={{ color: '#374151' }}>Aktif (ditampilkan di publik)</label>
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