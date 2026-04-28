'use client'
// app/(admin)/admin/ppid/seputar/_SeputarPPIDPage.tsx
import { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import {
  AdminCard, AdminCardHeader, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, useToast,
} from '@/components/admin/AdminUI'
import { useUploadThing } from '@/lib/uploadthing-client'

type SeputarPPID = {
  id: string
  judul: string
  konten: string
  nama: string | null
  jabatan: string | null
  foto: string | null
}

function ImageUpload({ label, value, onChange }: {
  label: string; value: string; onChange: (u: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr]   = useState('')

  const { startUpload } = useUploadThing('profileUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) onChange(res[0].ufsUrl)
      setBusy(false)
    },
    onUploadError: (e) => {
      setErr(e.message ?? 'Gagal upload')
      setBusy(false)
    },
  })

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr('')
    setBusy(true)
    await startUpload([file])
    e.target.value = ''
  }

  return (
    <FormField label={label}>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau upload"
            className="flex-1"
          />
          <label
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer"
            style={{
              background:    busy ? '#F3F4F6' : '#EFF6FF',
              color:         busy ? '#9CA3AF' : '#1565C0',
              borderColor:   busy ? '#E5E7EB' : '#BFDBFE',
              pointerEvents: busy ? 'none'    : 'auto',
            }}
          >
            {busy ? '⏳ Mengupload...' : '📁 Upload'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFile}
              disabled={busy}
            />
          </label>
        </div>
        {err && <p className="text-xs" style={{ color: '#DC2626' }}>{err}</p>}
        {value && (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border" style={{ borderColor: '#E5E7EB' }}>
            <Image src={value} alt="preview" fill className="object-cover" sizes="128px" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.55)' }}
            >✕</button>
          </div>
        )}
      </div>
    </FormField>
  )
}

export default function SeputarPPIDPage() {
  const [data, setData]  = useState<SeputarPPID | null>(null)
  const [form, setForm]  = useState<Partial<SeputarPPID> | null>(null)
  const [pending, start] = useTransition()
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
        const res  = await fetch('/api/admin/ppid/seputar', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(form),
        })
        const saved = await res.json()
        show('Data berhasil disimpan')
        setData(saved)
        setForm(saved)
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
                <Input
                  value={form.judul ?? ''}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  placeholder="Judul halaman seputar PPID"
                />
              </FormField>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Nama Kepala PPID">
                  <Input
                    value={form.nama ?? ''}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Nama pejabat PPID"
                  />
                </FormField>
                <FormField label="Jabatan">
                  <Input
                    value={form.jabatan ?? ''}
                    onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                    placeholder="Jabatan pejabat PPID"
                  />
                </FormField>
              </div>
              <ImageUpload
                label="Foto Kepala PPID"
                value={form.foto ?? ''}
                onChange={(foto) => setForm({ ...form, foto })}
              />
              <FormField label="Konten / Narasi" required>
                <Textarea
                  rows={8}
                  value={form.konten ?? ''}
                  onChange={(e) => setForm({ ...form, konten: e.target.value })}
                  placeholder="Isi narasi tentang PPID…"
                />
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