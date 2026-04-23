'use client'
// app/(admin)/admin/ppid/struktur-organisasi/_StrukturOrganisasiPPIDPage.tsx
import { useEffect, useState, useTransition } from 'react'
import { useUploadThing } from '@/lib/uploadthing-client'

import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type StrukturOrg = { id: string; gambar: string; deskripsi: string | null; aktif: boolean }

// ── komponen upload gambar ──────────────────────────────────────────────────
function ImageUploadField({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr]   = useState('')

  const { startUpload } = useUploadThing('imageUploader', {
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
    <FormField label="Gambar Struktur" hint="Upload gambar maks 4MB, atau isi URL langsung">
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau upload gambar"
            className="flex-1"
          />
          <label
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer"
            style={{
              background: busy ? '#F3F4F6' : '#EFF6FF',
              color: busy ? '#9CA3AF' : '#1D4ED8',
              borderColor: busy ? '#E5E7EB' : '#BFDBFE',
              pointerEvents: busy ? 'none' : 'auto',
            }}
          >
            {busy ? '⏳ Mengupload...' : '🖼️ Upload Gambar'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={busy}
            />
          </label>
        </div>

        {err && <p className="text-xs" style={{ color: '#DC2626' }}>{err}</p>}

        {value && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="preview"
              className="max-h-48 w-full rounded-xl object-contain border border-slate-100 bg-slate-50"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >✕</button>
          </div>
        )}
      </div>
    </FormField>
  )
}

// ── halaman utama ───────────────────────────────────────────────────────────
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
    if (!form?.gambar) return show('Gambar wajib diisi', 'error')
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
                  <img
                    src={d.gambar}
                    alt="struktur"
                    className="h-14 w-24 object-cover rounded-lg border border-slate-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
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

            {/* ← pakai ImageUploadField, bukan Input biasa */}
            <ImageUploadField
              value={form.gambar ?? ''}
              onChange={(gambar) => setForm({ ...form, gambar })}
            />

            <FormField label="Deskripsi">
              <Textarea
                rows={2}
                value={form.deskripsi ?? ''}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              />
            </FormField>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="aktif-so"
                checked={form.aktif ?? true}
                onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
              />
              <label htmlFor="aktif-so" className="text-xs font-semibold" style={{ color: '#374151' }}>
                Aktif (ditampilkan di publik)
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