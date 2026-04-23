'use client'
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type Statistik = { id: string; label: string; nilai: string; ikon: string | null; urutan: number }

const IKON_OPTIONS = ['Building2', 'MapPin', 'FileText', 'Shield', 'Users', 'Star', 'Globe', 'Award']

export default function StatistikBerandaPage() {
  const [list, setList]   = useState<Statistik[]>([])
  const [form, setForm]   = useState<Partial<Statistik> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/beranda/statistik').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.label) return show('Label wajib diisi', 'error')
    if (!form?.nilai) return show('Nilai wajib diisi', 'error')
    start(async () => {
      try {
        const method = form.id ? 'PUT' : 'POST'
        await fetch('/api/admin/beranda/statistik', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, urutan: form.urutan ? Number(form.urutan) : 0 }),
        })
        show(form.id ? 'Statistik diperbarui' : 'Statistik ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/beranda/statistik?id=${id}`, { method: 'DELETE' }); load()
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Statistik Beranda"
          action={<BtnAdd label="Tambah Statistik" onClick={() => setForm({ urutan: list.length + 1 })} />} />
        <AdminTable headers={['Ikon', 'Label', 'Nilai', 'Urutan', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={5}><EmptyState label="Belum ada data statistik" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <span className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-sm"
                    style={{ background: '#EFF6FF', color: '#0D47A1' }}>
                    {d.ikon ?? '📊'}
                  </span>
                </AdminTd>
                <AdminTd><p className="font-semibold text-sm" style={{ color: '#0A2342' }}>{d.label}</p></AdminTd>
                <AdminTd>
                  <span className="font-bold text-lg" style={{ color: '#0D47A1' }}>{d.nilai}</span>
                </AdminTd>
                <AdminTd>
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-xs font-bold"
                    style={{ background: '#EFF6FF', color: '#0D47A1' }}>{d.urutan}</span>
                </AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...d })} />
                    <BtnDelete label={d.label} onConfirm={() => handleDelete(d.id)} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Statistik' : 'Tambah Statistik'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <FormField label="Label" required>
              <Input value={form.label ?? ''} onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="cth: Jumlah ASN" />
            </FormField>
            <FormField label="Nilai" required>
              <Input value={form.nilai ?? ''} onChange={(e) => setForm({ ...form, nilai: e.target.value })}
                placeholder="cth: 1.234 atau 98%" />
            </FormField>
            <FormField label="Ikon" hint="Pilih nama ikon Lucide">
              <select
                value={form.ikon ?? ''}
                onChange={(e) => setForm({ ...form, ikon: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: '#E2E8F0', color: '#0A2342' }}>
                <option value="">-- Pilih Ikon --</option>
                {IKON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
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