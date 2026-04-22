'use client'
// app/(admin)/admin/ppid/seputar/_SeputarPPIDPage.tsx
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, useToast,
} from '@/components/admin/AdminUI'

type SeputarPPID = {
  id: string
  judul: string
  konten: string
  nama: string | null
  jabatan: string | null
  foto: string | null
}

export default function SeputarPPIDPage() {
  const [data, setData]   = useState<SeputarPPID | null>(null)
  const [form, setForm]   = useState<Partial<SeputarPPID> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  useEffect(() => {
    fetch('/api/admin/ppid/seputar')
      .then((r) => r.json())
      .then((d) => { setData(d); setForm(d) })
  }, [])

  function handleSave() {
    if (!form?.judul || !form?.konten) return show('Judul dan konten wajib diisi', 'error')
    start(async () => {
      try {
        await fetch('/api/admin/ppid/seputar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        show('Data berhasil disimpan')
        setData(form as SeputarPPID)
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Seputar PPID" />
        <div className="p-5 flex flex-col gap-4">
          {form === null ? (
            <p className="text-sm text-slate-400">Memuat data…</p>
          ) : (
            <>
              <FormField label="Judul" required>
                <Input value={form.judul ?? ''} onChange={(e) => setForm({ ...form, judul: e.target.value })} placeholder="Judul halaman seputar PPID" />
              </FormField>
              <FormField label="Konten / Narasi">
                <Textarea rows={8} value={form.konten ?? ''} onChange={(e) => setForm({ ...form, konten: e.target.value })} placeholder="Isi narasi tentang PPID…" />
              </FormField>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Nama Kepala PPID">
                  <Input value={form.nama ?? ''} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama pejabat PPID" />
                </FormField>
                <FormField label="Jabatan">
                  <Input value={form.jabatan ?? ''} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} placeholder="Jabatan pejabat PPID" />
                </FormField>
              </div>
              <FormField label="URL Foto">
                <Input value={form.foto ?? ''} onChange={(e) => setForm({ ...form, foto: e.target.value })} placeholder="https://…" />
              </FormField>
              <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid #EEF3FC' }}>
                <BtnSecondary onClick={() => setForm(data)}>Reset</BtnSecondary>
                <BtnPrimary onClick={handleSave} loading={pending}>Simpan</BtnPrimary>
              </div>
            </>
          )}
        </div>
      </AdminCard>
    </div>
  )
}