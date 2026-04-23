'use client'
import { useEffect, useState, useTransition } from 'react'
import { useUploadThing } from '@/lib/uploadthing-client'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type SitusTerkait = {
  id: string; label: string; href: string; external: boolean
  thumbnail: string[]; urutan: number; aktif: boolean
}

// ── Upload satu gambar dan tambah ke array thumbnail ─────────────────────────
function ThumbnailArrayField({
  value,
  onChange,
}: {
  value: string[]
  onChange: (urls: string[]) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr]   = useState('')

  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) onChange([...value, res[0].ufsUrl])
      setBusy(false)
    },
    onUploadError: (e) => { setErr(e.message ?? 'Upload gagal'); setBusy(false) },
  })

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setErr(''); setBusy(true); await startUpload([file]); e.target.value = ''
  }

  function addUrl(url: string) {
    if (url.trim()) onChange([...value, url.trim()])
  }

  const [inputUrl, setInputUrl] = useState('')

  return (
    <FormField label="Thumbnail (bisa lebih dari 1)" hint="Upload atau masukkan URL, lalu klik Tambah">
      <div className="flex flex-col gap-2">
        {/* Input URL manual */}
        <div className="flex gap-2">
          <Input value={inputUrl} onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://... URL gambar" className="flex-1"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(inputUrl); setInputUrl('') } }} />
          <button type="button"
            onClick={() => { addUrl(inputUrl); setInputUrl('') }}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border"
            style={{ background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' }}>
            Tambah
          </button>
        </div>

        {/* Upload tombol */}
        <label className="self-start px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer"
          style={{ background: busy ? '#F3F4F6' : '#F0FDF4', color: busy ? '#9CA3AF' : '#15803D',
            borderColor: busy ? '#E5E7EB' : '#BBF7D0', pointerEvents: busy ? 'none' : 'auto' }}>
          {busy ? '⏳ Mengupload...' : '🖼️ Upload Gambar'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
        </label>

        {err && <p className="text-xs" style={{ color: '#DC2626' }}>{err}</p>}

        {/* Preview list */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {value.map((url, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`thumb-${i}`}
                  className="h-16 w-24 object-cover rounded-lg border border-slate-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <button type="button"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: '#DC2626' }}>✕</button>
                <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white px-1 rounded"
                  style={{ background: 'rgba(0,0,0,0.5)' }}>#{i + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormField>
  )
}

export default function SitusTerkaitPage() {
  const [list, setList]   = useState<SitusTerkait[]>([])
  const [form, setForm]   = useState<Partial<SitusTerkait> | null>(null)
  const [pending, start]  = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/beranda/situs-terkait').then((r) => r.json()).then(setList)
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.label) return show('Label wajib diisi', 'error')
    if (!form?.href)  return show('URL wajib diisi', 'error')
    start(async () => {
      try {
        const method = form.id ? 'PUT' : 'POST'
        await fetch('/api/admin/beranda/situs-terkait', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            thumbnail: form.thumbnail ?? [],
            urutan: form.urutan ? Number(form.urutan) : 0,
            aktif: form.aktif ?? true,
            external: form.external ?? true,
          }),
        })
        show(form.id ? 'Situs diperbarui' : 'Situs ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/beranda/situs-terkait?id=${id}`, { method: 'DELETE' }); load()
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Daftar Aplikasi / Situs Terkait"
          action={<BtnAdd label="Tambah Situs" onClick={() => setForm({ aktif: true, external: true, thumbnail: [], urutan: list.length + 1 })} />} />
        <AdminTable headers={['Thumbnail', 'Label', 'URL', 'Urutan', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada situs terkait" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  {d.thumbnail?.[0]
                    ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={d.thumbnail[0]} alt={d.label}
                        className="h-10 w-16 object-cover rounded-lg border border-slate-100"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    )
                    : <span className="text-slate-300 text-xs">—</span>}
                </AdminTd>
                <AdminTd>
                  <p className="font-semibold text-sm" style={{ color: '#0A2342' }}>{d.label}</p>
                  <p className="text-[10px] text-slate-400">{d.external ? '🔗 Eksternal' : '📄 Internal'}</p>
                </AdminTd>
                <AdminTd>
                  <a href={d.href} target="_blank" rel="noopener noreferrer"
className="text-xs font-mono truncate max-w-45 block"                    style={{ color: '#1D4ED8' }}>{d.href}</a>
                </AdminTd>
                <AdminTd>
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-xs font-bold"
                    style={{ background: '#EFF6FF', color: '#0D47A1' }}>{d.urutan}</span>
                </AdminTd>
                <AdminTd><StatusBadge active={d.aktif} /></AdminTd>
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
          <AdminCardHeader title={form.id ? 'Edit Situs' : 'Tambah Situs Terkait'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <FormField label="Label / Nama Aplikasi" required>
              <Input value={form.label ?? ''} onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="cth: G-SINJAB" />
            </FormField>
            <FormField label="URL" required>
              <Input value={form.href ?? ''} onChange={(e) => setForm({ ...form, href: e.target.value })}
                placeholder="https://..." />
            </FormField>
            <FormField label="Urutan">
              <Input type="number" value={form.urutan ?? ''} onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })} />
            </FormField>
            <div className="flex flex-col gap-3 justify-end pb-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="ext-st" checked={form.external ?? true}
                  onChange={(e) => setForm({ ...form, external: e.target.checked })} />
                <label htmlFor="ext-st" className="text-xs font-semibold" style={{ color: '#374151' }}>
                  Buka di tab baru (external)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="aktif-st" checked={form.aktif ?? true}
                  onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
                <label htmlFor="aktif-st" className="text-xs font-semibold" style={{ color: '#374151' }}>Aktif</label>
              </div>
            </div>
            <div className="sm:col-span-2">
              <ThumbnailArrayField
                value={form.thumbnail ?? []}
                onChange={(thumbnail) => setForm({ ...form, thumbnail })} />
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