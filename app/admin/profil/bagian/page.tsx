'use client'
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnEdit, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, Select, EmptyState, useToast,
} from '@/components/admin/AdminUI'
import { upsertBagian } from '@/actions/admin'
import type { BagianSlug } from '@prisma/client'

type Bagian = {
  id: string; nama: string; slug: BagianSlug
  deskripsi: string | null; konten: string | null; urutan: number
}

const SLUG_OPTIONS: { value: BagianSlug; label: string }[] = [
  { value: 'KELEMBAGAAN_ANALISIS_JABATAN',      label: 'Kelembagaan & Analisis Jabatan' },
  { value: 'REFORMASI_BIROKRASI_AKUNTABILITAS', label: 'Reformasi Birokrasi & Akuntabilitas' },
  { value: 'TATA_LAKSANA',                      label: 'Tata Laksana' },
]

export default function BagianPage() {
  const [list, setList]   = useState<Bagian[]>([])
  const [form, setForm]   = useState<Partial<Bagian> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/bagian').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.nama || !form?.slug) return show('Nama dan slug wajib diisi', 'error')
    start(async () => {
      try {
        await upsertBagian({
          id: form.id, nama: form.nama!, slug: form.slug!,
          deskripsi: form.deskripsi ?? undefined,
          konten: form.konten ?? undefined,
          urutan: form.urutan ?? 0,
        })
        show(form.id ? 'Bagian diperbarui' : 'Bagian disimpan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Bagian" />
        <AdminTable headers={['Nama', 'Slug', 'Urutan', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={4}><EmptyState label="Belum ada data bagian" /></td></tr>
            : list.map((b) => (
              <AdminTr key={b.id}>
                <AdminTd>
                  <p className="font-semibold" style={{ color: '#0A2342' }}>{b.nama}</p>
                  {b.deskripsi && <p className="text-xs line-clamp-1 mt-0.5" style={{ color: '#64748B' }}>{b.deskripsi}</p>}
                </AdminTd>
                <AdminTd>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                    style={{ background: '#F0FDF4', color: '#15803D' }}>
                    {SLUG_OPTIONS.find((s) => s.value === b.slug)?.label ?? b.slug}
                  </span>
                </AdminTd>
                <AdminTd>{b.urutan}</AdminTd>
                <AdminTd>
                  <BtnEdit onClick={() => setForm({ ...b })} />
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title="Edit Bagian" />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <FormField label="Nama Bagian" required>
              <Input value={form.nama ?? ''} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
            </FormField>
            <FormField label="Slug / Tipe">
              <Select value={form.slug ?? ''} onChange={(e) => setForm({ ...form, slug: e.target.value as BagianSlug })}>
                <option value="">-- Pilih --</option>
                {SLUG_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </FormField>
            <FormField label="Urutan">
              <Input type="number" value={form.urutan ?? 0}
                onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })} />
            </FormField>
            <FormField label="Deskripsi Singkat">
              <Input value={form.deskripsi ?? ''} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Konten">
                <Textarea rows={8} value={form.konten ?? ''} onChange={(e) => setForm({ ...form, konten: e.target.value })} />
              </FormField>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
            <BtnSecondary onClick={() => setForm(null)}>Batal</BtnSecondary>
            <BtnPrimary onClick={handleSave} loading={pending}>Simpan</BtnPrimary>
          </div>
        </AdminCard>
      )}
    </div>
  )
}