'use client'
// app/(admin)/admin/galeri/_GaleriPage.tsx
import { useEffect, useRef, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, Select, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'
import { upsertGaleri, deleteGaleri } from '@/actions/admin'
import Image from 'next/image'

type Galeri = {
  id: string; judul: string; tipe: 'FOTO' | 'VIDEO'
  url: string; thumbnail: string | null; deskripsi: string | null
  urutan: number; aktif: boolean; tags: string[]
}

// ── Upload helper ──────────────────────────────────────────────────────────────
async function uploadImage(file: File, folder: 'galeri' | 'thumbnail'): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', folder)          // dikirim ke API agar disimpan di subfolder yg benar
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? 'Upload gagal')
  }
  const { url } = await res.json()
  return url
}

// ── Komponen tombol upload ─────────────────────────────────────────────────────
function ImageUploadField({
  label, value, onChange, hint,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
}) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err,  setErr]  = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr(''); setBusy(true)
    try {
      const url = await uploadImage(file, label === 'URL Thumbnail' ? 'thumbnail' : 'galeri')
      onChange(url)
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : 'Upload gagal')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <FormField label={label} hint={hint}>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau upload file"
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
            style={{
              background: busy ? '#F3F4F6' : '#EFF6FF',
              color: busy ? '#9CA3AF' : '#1565C0',
              borderColor: busy ? '#E5E7EB' : '#BFDBFE',
              cursor: busy ? 'not-allowed' : 'pointer',
            }}
          >
            {busy ? '⏳ Upload…' : '📁 Upload'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {err && (
          <p className="text-xs" style={{ color: '#DC2626' }}>{err}</p>
        )}

        {/* Preview jika ada URL */}
        {value && (
          <div className="relative w-full h-36 rounded-xl overflow-hidden border" style={{ borderColor: '#E5E7EB' }}>
            <Image src={value} alt="preview" fill className="object-cover" sizes="400px"
              onError={() => {/* biarkan broken image terlihat */}} />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.55)' }}
              title="Hapus gambar"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </FormField>
  )
}

// ── Halaman utama ──────────────────────────────────────────────────────────────
export default function GaleriPage() {
  const [list, setList]   = useState<Galeri[]>([])
  const [form, setForm]   = useState<Partial<Galeri> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/galeri').then((r) => r.json()).then((d) => setList(d))
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/galeri').then((r) => r.json()).then((d) => { if (!cancelled) setList(d) })
    return () => { cancelled = true }
  }, [])

  function handleSave() {
    if (!form?.judul || !form?.url) return show('Judul dan URL wajib diisi', 'error')
    start(async () => {
      try {
        await upsertGaleri({
          id:        form.id,
          judul:     form.judul!,
          url:       form.url!,
          tipe:      form.tipe ?? 'FOTO',
          thumbnail: form.thumbnail ?? undefined,
          deskripsi: form.deskripsi ?? undefined,
          tags:      form.tags ?? [],
          urutan:    form.urutan ?? 0,
          aktif:     form.aktif ?? true,
        })
        show(form.id ? 'Galeri diperbarui' : 'Galeri ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader
          title="Galeri Foto/Video"
          action={
            <BtnAdd label="Tambah" onClick={() =>
              setForm({ tipe: 'FOTO', aktif: true, urutan: 0, tags: [] })} />
          }
        />
        <AdminTable headers={['Preview', 'Judul', 'Tipe', 'Urutan', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada galeri" /></td></tr>
            : list.map((g) => (
              <AdminTr key={g.id}>
                <AdminTd>
                  {(g.thumbnail || g.url) && (
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden">
                      <Image src={g.thumbnail ?? g.url} alt={g.judul} fill
                        className="object-cover" sizes="56px" />
                    </div>
                  )}
                </AdminTd>
                <AdminTd>
                  <p className="font-semibold line-clamp-1" style={{ color: '#0A2342' }}>{g.judul}</p>
                </AdminTd>
                <AdminTd>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                    style={{
                      background: g.tipe === 'FOTO' ? '#EFF6FF' : '#F5F3FF',
                      color:      g.tipe === 'FOTO' ? '#1565C0' : '#7C3AED',
                    }}>
                    {g.tipe}
                  </span>
                </AdminTd>
                <AdminTd>{g.urutan}</AdminTd>
                <AdminTd><StatusBadge active={g.aktif} /></AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...g })} />
                    <BtnDelete label={g.judul}
                      onConfirm={async () => { await deleteGaleri(g.id); load() }} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Galeri' : 'Tambah Galeri'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">

            {/* Judul */}
            <FormField label="Judul" required>
              <Input value={form.judul ?? ''}
                onChange={(e) => setForm({ ...form, judul: e.target.value })} />
            </FormField>

            {/* Tipe */}
            <FormField label="Tipe">
              <Select value={form.tipe ?? 'FOTO'}
                onChange={(e) => setForm({ ...form, tipe: e.target.value as 'FOTO' | 'VIDEO' })}>
                <option value="FOTO">Foto</option>
                <option value="VIDEO">Video</option>
              </Select>
            </FormField>

            {/* URL Media — dengan upload (hanya FOTO) */}
            {form.tipe === 'VIDEO' ? (
              <FormField label="URL Video" required hint="Link YouTube / Vimeo">
                <Input value={form.url ?? ''}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..." />
              </FormField>
            ) : (
              <ImageUploadField
                label="URL Media"
                value={form.url ?? ''}
                onChange={(url) => setForm({ ...form, url })}
                hint="Upload JPG/PNG/WebP maks 2MB, atau isi URL langsung"
              />
            )}

            {/* Thumbnail */}
            <ImageUploadField
              label="URL Thumbnail"
              value={form.thumbnail ?? ''}
              onChange={(url) => setForm({ ...form, thumbnail: url })}
              hint="Opsional — thumbnail untuk video atau override foto"
            />

            {/* Urutan */}
            <FormField label="Urutan">
              <Input type="number" value={form.urutan ?? 0}
                onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })} />
            </FormField>

            {/* Tags */}
            <FormField label="Tags" hint="Pisahkan koma">
              <Input
                value={(form.tags ?? []).join(', ')}
                onChange={(e) =>
                  setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
              />
            </FormField>

            {/* Deskripsi */}
            <div className="sm:col-span-2">
              <FormField label="Deskripsi">
                <Textarea value={form.deskripsi ?? ''}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
              </FormField>
            </div>

            {/* Aktif */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="aktif-galeri"
                checked={form.aktif ?? true}
                onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-galeri" className="text-xs font-semibold"
                style={{ color: '#374151' }}>Tampilkan di website</label>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-5 py-3"
            style={{ borderTop: '1px solid #EEF3FC' }}>
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