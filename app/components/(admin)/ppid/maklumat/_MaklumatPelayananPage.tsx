'use client'
import { useEffect, useState, useTransition } from 'react'
import { useUploadThing } from '@/lib/uploadthing-client'
import Image from 'next/image'

import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type Maklumat = { id: string; konten: string; gambar: string | null; aktif: boolean }

function ImageUploadField({
  value, onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const { startUpload } = useUploadThing('profileUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) onChange(res[0].ufsUrl)
      setBusy(false)
    },
    onUploadError: (e) => {
      setErr(e.message ?? 'Upload gagal')
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
    <FormField label="Gambar Maklumat" hint="Upload JPG/PNG/WebP maks 4MB, atau isi URL langsung">
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
              onChange={handleFile}
              disabled={busy}
            />
          </label>
        </div>
        {err && <p className="text-xs" style={{ color: '#DC2626' }}>{err}</p>}
        {value && (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border" style={{ borderColor: '#E5E7EB' }}>
            <Image src={value} alt="preview" fill className="object-contain bg-slate-50" sizes="600px" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.55)' }}
            >✕</button>
          </div>
        )}
      </div>
    </FormField>
  )
}

export default function MaklumatPelayananPage() {
  const [list, setList] = useState<Maklumat[]>([])
  const [form, setForm] = useState<Partial<Maklumat> | null>(null)
  const [pending, start] = useTransition()
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

      <div className="rounded-xl px-4 py-3 text-xs flex items-center gap-2"
        style={{ background: '#FFFBEB', border: '1px solid #FCD34D', color: '#B45309' }}>
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
                  <p className="text-xs text-slate-600 line-clamp-3 max-w-sm"
                    dangerouslySetInnerHTML={{ __html: d.konten.substring(0, 200) }} />
                </AdminTd>
                <AdminTd>
                  {d.gambar
                    ? (
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-slate-100">
                        <Image src={d.gambar} alt="maklumat" fill className="object-cover" sizes="64px" />
                      </div>
                    )
                    : <span className="text-slate-300 text-xs">-</span>}
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
            <ImageUploadField
              value={form.gambar ?? ''}
              onChange={(gambar) => setForm({ ...form, gambar })}
            />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="aktif-mk"
                checked={form.aktif ?? true}
                onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-mk" className="text-xs font-semibold"
                style={{ color: '#374151' }}>Aktif</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
            <BtnSecondary onClick={() => setForm(null)}>Batal</BtnSecondary>
            <BtnPrimary onClick={handleSave} loading={pending}>
              {form.id ? 'Simpan' : 'Tambah'}
            </BtnPrimary>
          </div>
        </AdminCard>
      )}
    </div>
  )
}