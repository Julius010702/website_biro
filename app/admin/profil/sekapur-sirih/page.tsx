'use client'
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, BtnPrimary,
  FormField, Input, Textarea, useToast,
} from '@/components/admin/AdminUI'
import { upsertSekapurSirih } from '@/actions/admin'
import Image from 'next/image'
import { useUploadThing } from '@/lib/uploadthing-client'

type SekapurSirih = {
  id: string; judul: string; konten: string
  foto: string | null; jabatan: string | null; nama: string | null
}

function ImageUpload({ label, value, onChange }: {
  label: string; value: string; onChange: (u: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const { startUpload } = useUploadThing('profileUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) {
        onChange(res[0].ufsUrl)
      }
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
              background: busy ? '#F3F4F6' : '#EFF6FF',
              color: busy ? '#9CA3AF' : '#1565C0',
              borderColor: busy ? '#E5E7EB' : '#BFDBFE',
              pointerEvents: busy ? 'none' : 'auto',
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

export default function SekapurSirihPage() {
  const [data, setData] = useState<Partial<SekapurSirih>>({})
  const [pending, start] = useTransition()
  const { show, ToastEl } = useToast()

  useEffect(() => {
    fetch('/api/admin/sekapur-sirih')
      .then((r) => r.json())
      .then((d) => { if (d) setData(d) })
  }, [])

  function handleSave() {
    if (!data.judul || !data.konten) return show('Judul dan konten wajib diisi', 'error')
    start(async () => {
      try {
        await upsertSekapurSirih({
          id: data.id,
          judul: data.judul!,
          konten: data.konten!,
          foto: data.foto ?? undefined,
          jabatan: data.jabatan ?? undefined,
          nama: data.nama ?? undefined,
        })
        show('Sekapur Sirih disimpan')
      } catch {
        show('Terjadi kesalahan', 'error')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Sekapur Sirih" />
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          <FormField label="Judul" required>
            <Input
              value={data.judul ?? ''}
              onChange={(e) => setData({ ...data, judul: e.target.value })}
            />
          </FormField>
          <FormField label="Nama Pejabat">
            <Input
              value={data.nama ?? ''}
              onChange={(e) => setData({ ...data, nama: e.target.value })}
            />
          </FormField>
          <FormField label="Jabatan">
            <Input
              value={data.jabatan ?? ''}
              onChange={(e) => setData({ ...data, jabatan: e.target.value })}
            />
          </FormField>
          <ImageUpload
            label="Foto Pejabat"
            value={data.foto ?? ''}
            onChange={(foto) => setData({ ...data, foto })}
          />
          <div className="sm:col-span-2">
            <FormField label="Konten / Sambutan" required>
              <Textarea
                rows={10}
                value={data.konten ?? ''}
                onChange={(e) => setData({ ...data, konten: e.target.value })}
              />
            </FormField>
          </div>
        </div>
        <div className="flex justify-end px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
          <BtnPrimary onClick={handleSave} loading={pending}>Simpan</BtnPrimary>
        </div>
      </AdminCard>
    </div>
  )
}