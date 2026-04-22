'use client'
// app/(admin)/admin/regulasi/_RegulasiPage.tsx
import { useEffect, useState, useTransition } from 'react'
import { AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd, BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary, FormField, Input, Textarea, Select, StatusBadge, EmptyState, useToast } from '@/components/admin/AdminUI'
import { upsertPeraturan, deletePeraturan } from '@/actions/admin'

type Peraturan = { id: string; nomor: string; judul: string; tahun: number; tipe: string; subTipe: string | null; tentang: string; file: string | null; aktif: boolean }

const TIPE_OPTIONS = ['UNDANG_UNDANG','PERATURAN_PEMERINTAH','PERATURAN_PRESIDEN','PERATURAN_KEMENDAGRI','PERATURAN_KEMENPANRB','PERATURAN_DAERAH','PERATURAN_GUBERNUR','KEPUTUSAN_GUBERNUR']

export default function RegulasiPage() {
  const [list, setList]   = useState<Peraturan[]>([])
  const [form, setForm]   = useState<Partial<Peraturan> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()
  function load() {
    fetch('/api/admin/regulasi').then((r) => r.json()).then((d) => setList(d))
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/regulasi').then((r) => r.json()).then((d) => { if (!cancelled) setList(d) })
    return () => { cancelled = true }
  }, [])

  function handleSave() {
    if (!form?.nomor || !form?.judul || !form?.tahun || !form?.tipe) return show('Lengkapi field wajib', 'error')
    start(async () => {
      try {
        await upsertPeraturan({
          id: form.id, nomor: form.nomor!, judul: form.judul!,
          tahun: Number(form.tahun), tentang: form.tentang ?? '',
          tipe: form.tipe as never, subTipe: form.subTipe ?? undefined,
          file: form.file ?? undefined, aktif: form.aktif ?? true,
        })
        show(form.id ? 'Peraturan diperbarui' : 'Peraturan ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Peraturan & Regulasi" action={<BtnAdd label="Tambah" onClick={() => setForm({ aktif: true, tahun: new Date().getFullYear() })} />} />
        <AdminTable headers={['Nomor', 'Judul', 'Tahun', 'Tipe', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada peraturan" /></td></tr>
            : list.map((p) => (
              <AdminTr key={p.id}>
                <AdminTd><span className="font-mono text-[10px]">{p.nomor}</span></AdminTd>
                <AdminTd><p className="font-semibold line-clamp-2 max-w-xs" style={{ color: '#0A2342' }}>{p.judul}</p></AdminTd>
                <AdminTd>{p.tahun}</AdminTd>
                <AdminTd><span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#EFF6FF', color: '#1565C0' }}>{p.tipe.replace(/_/g, ' ')}</span></AdminTd>
                <AdminTd><StatusBadge active={p.aktif} /></AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...p })} />
                    <BtnDelete label={p.judul} onConfirm={async () => { await deletePeraturan(p.id); load() }} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Peraturan' : 'Tambah Peraturan'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <FormField label="Nomor" required>
              <Input value={form.nomor ?? ''} onChange={(e) => setForm({ ...form, nomor: e.target.value })} placeholder="Misal: 5 Tahun 2024" />
            </FormField>
            <FormField label="Tahun" required>
              <Input type="number" value={form.tahun ?? ''} onChange={(e) => setForm({ ...form, tahun: Number(e.target.value) })} />
            </FormField>
            <FormField label="Tipe" required>
              <Select value={form.tipe ?? ''} onChange={(e) => setForm({ ...form, tipe: e.target.value })}>
                <option value="">-- Pilih Tipe --</option>
                {TIPE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </Select>
            </FormField>
            <FormField label="Sub Tipe" hint="Misal: kelembagaan, reformasi, tata laksana">
              <Input value={form.subTipe ?? ''} onChange={(e) => setForm({ ...form, subTipe: e.target.value })} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Judul" required>
                <Input value={form.judul ?? ''} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Tentang" required>
                <Textarea value={form.tentang ?? ''} onChange={(e) => setForm({ ...form, tentang: e.target.value })} rows={3} />
              </FormField>
            </div>
            <FormField label="URL File">
              <Input value={form.file ?? ''} onChange={(e) => setForm({ ...form, file: e.target.value })} placeholder="https://..." />
            </FormField>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#374151' }}>
                <input type="checkbox" checked={form.aktif ?? true} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
                Aktif
              </label>
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