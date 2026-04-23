'use client'
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, BtnPrimary,
  FormField, Input, Textarea, StatusBadge, useToast,
} from '@/components/admin/AdminUI'
import { upsertStrukturOrganisasi } from '@/actions/admin'
import { useUploadThing } from '@/lib/uploadthing-client'
import Image from 'next/image'

type Struktur = { id: string; gambar: string; deskripsi: string | null; aktif: boolean }

export default function StrukturOrganisasiPage() {
  const [data, setData] = useState<Partial<Struktur>>({ aktif: true })
  const [busy, setBusy] = useState(false)
  const [imgErr, setImgErr] = useState('')
  const [pending, start] = useTransition()
  const { show, ToastEl } = useToast()

  const { startUpload } = useUploadThing('profileUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) {
        setData((p) => ({ ...p, gambar: res[0].ufsUrl }))
      }
      setBusy(false)
    },
    onUploadError: (e) => {
      setImgErr(e.message ?? 'Gagal upload')
      setBusy(false)
    },
  })

  useEffect(() => {
    fetch('/api/admin/struktur-organisasi')
      .then((r) => r.json())
      .then((d) => { if (d) setData(d) })
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImgErr('')
    setBusy(true)
    await startUpload([file])
    e.target.value = ''
  }

  function handleSave() {
    if (!data.gambar) return show('Gambar wajib diisi', 'error')
    start(async () => {
      try {
        await upsertStrukturOrganisasi({
          id: data.id,
          gambar: data.gambar!,
          deskripsi: data.deskripsi ?? undefined,
          aktif: data.aktif ?? true,
        })
        show('Struktur Organisasi disimpan')
      } catch {
        show('Terjadi kesalahan', 'error')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Struktur Organisasi" />
        <div className="p-5 flex flex-col gap-4">

          {/* Preview gambar */}
          {data.gambar && (
            <div
              className="relative w-full rounded-xl overflow-hidden border"
              style={{ borderColor: '#E5E7EB', aspectRatio: '16/7' }}
            >
              <Image
                src={data.gambar}
                alt="Struktur Organisasi"
                fill
                className="object-contain bg-gray-50"
                sizes="800px"
              />
              <button
                type="button"
                onClick={() => setData((p) => ({ ...p, gambar: '' }))}
                className="absolute top-2 right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.55)' }}
              >✕</button>
            </div>
          )}

          <FormField label="Gambar Struktur" required hint="Upload JPG/PNG/WebP maks 4MB">
            <div className="flex gap-2">
              <Input
                value={data.gambar ?? ''}
                onChange={(e) => setData({ ...data, gambar: e.target.value })}
                placeholder="https://... atau upload file"
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
                  onChange={handleUpload}
                  disabled={busy}
                />
              </label>
            </div>
            {imgErr && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{imgErr}</p>}
          </FormField>

          <FormField label="Deskripsi">
            <Textarea
              value={data.deskripsi ?? ''}
              onChange={(e) => setData({ ...data, deskripsi: e.target.value })}
            />
          </FormField>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="aktif-struktur"
              checked={data.aktif ?? true}
              onChange={(e) => setData({ ...data, aktif: e.target.checked })}
            />
            <label htmlFor="aktif-struktur" className="text-xs font-semibold" style={{ color: '#374151' }}>
              Tampilkan di website
            </label>
            <StatusBadge active={data.aktif ?? true} />
          </div>
        </div>

        <div className="flex justify-end px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
          <BtnPrimary onClick={handleSave} loading={pending}>Simpan</BtnPrimary>
        </div>
      </AdminCard>
    </div>
  )
}