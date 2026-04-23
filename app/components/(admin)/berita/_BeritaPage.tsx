'use client'
// app/components/(admin)/berita/_BeritaPage.tsx
// ✅ SATU FILE — mencakup ImageUploader + BeritaPage lengkap

import { useEffect, useState, useTransition, useCallback, useRef } from 'react'
import { useToast } from '@/components/admin/AdminUI'
import { upsertBerita, deleteBerita, togglePublishBerita } from '@/actions/admin'
import {
  Eye, Search, Upload, Link2, X, Loader2, ImageIcon,
  CheckCircle2, AlertCircle, FileImage, ExternalLink,
  Calendar, Tag, User, Newspaper, RefreshCw,
} from 'lucide-react'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Berita = {
  konten: string
  id: string
  judul: string
  slug: string
  ringkasan: string | null
  gambar: string | null
  kategori: string | null
  penulis: string | null
  publish: boolean
  views: number
  createdAt: string
  tags: string[]
}

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatTanggal(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ─────────────────────────────────────────────
// ImageUploader Component (inline)
// ─────────────────────────────────────────────
function ImageUploader({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [tab, setTab]             = useState<'upload' | 'url'>(value ? 'url' : 'upload')
  const [urlInput, setUrlInput]   = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging]   = useState(false)
  const [imgError, setImgError]   = useState(false)
  const [status, setStatus]       = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  // Reset img error saat value berubah
  useEffect(() => { setImgError(false) }, [value])

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return setStatus({ type: 'error', msg: 'File harus berupa gambar (JPG, PNG, WEBP, GIF)' })
    }
    if (file.size > 4 * 1024 * 1024) {
      return setStatus({ type: 'error', msg: 'Ukuran file maksimal 4MB' })
    }

    setUploading(true)
    setStatus(null)

    try {
      // Coba upload via UploadThing
      const presignRes = await fetch('/api/uploadthing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: [{ name: file.name, size: file.size, type: file.type }],
        }),
      })

      if (presignRes.ok) {
        const uploadData = await presignRes.json()
        const slot = uploadData?.[0]

        if (slot?.url) {
          const fd = new FormData()
          Object.entries(slot.fields ?? {}).forEach(([k, v]) => fd.append(k, v as string))
          fd.append('file', file)

          const upRes = await fetch(slot.url, { method: 'POST', body: fd })
          if (upRes.ok) {
            const finalUrl = slot.fileUrl ?? `${slot.url}/${slot.fields?.key ?? file.name}`
            onChange(finalUrl)
            setStatus({ type: 'success', msg: 'Gambar berhasil diupload!' })
            setUploading(false)
            return
          }
        }
      }

      // Fallback: Base64 preview (hanya untuk development/preview)
      const reader = new FileReader()
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        onChange(b64)
        setStatus({ type: 'success', msg: 'Gambar dimuat sebagai preview lokal.' })
        setUploading(false)
      }
      reader.onerror = () => {
        setStatus({ type: 'error', msg: 'Gagal membaca file.' })
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setStatus({ type: 'error', msg: 'Upload gagal. Gunakan tab URL sebagai alternatif.' })
      setUploading(false)
    }
  }, [onChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleUrlApply = () => {
    const url = urlInput.trim()
    if (!url) return setStatus({ type: 'error', msg: 'URL tidak boleh kosong' })
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return setStatus({ type: 'error', msg: 'URL harus diawali https://' })
    }
    onChange(url)
    setUrlInput('')
    setStatus({ type: 'success', msg: 'URL gambar berhasil diterapkan!' })
  }

  const handleRemove = () => {
    onChange('')
    setStatus(null)
    setImgError(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tab switcher */}
      <div style={{
        display: 'flex', gap: 4, padding: 4,
        background: '#EEF3FC', borderRadius: 12,
      }}>
        {(['upload', 'url'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setStatus(null) }}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
              transition: 'all .15s',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? '#0D47A1' : '#94A3B8',
              boxShadow: tab === t ? '0 1px 6px rgba(13,71,161,.15)' : 'none',
            }}
          >
            {t === 'upload'
              ? <><Upload size={12} /> Upload File</>
              : <><Link2 size={12} /> Pakai URL</>
            }
          </button>
        ))}
      </div>

      {/* Upload area */}
      {tab === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onClick={() => !uploading && inputRef.current?.click()}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 10,
            padding: '28px 16px',
            border: `2px dashed ${dragging ? '#1D4ED8' : '#BFDBFE'}`,
            borderRadius: 14,
            background: dragging ? '#EFF6FF' : uploading ? '#F0FDF4' : '#F8FAFF',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all .2s',
            minHeight: 100,
          }}
        >
          {uploading ? (
            <>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Loader2 size={22} color="#1D4ED8" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1D4ED8', margin: 0 }}>Mengupload...</p>
            </>
          ) : dragging ? (
            <>
              <FileImage size={32} color="#1D4ED8" />
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1D4ED8', margin: 0 }}>Lepaskan untuk upload</p>
            </>
          ) : (
            <>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Upload size={20} color="#1D4ED8" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#1D4ED8', margin: '0 0 2px' }}>
                  Klik atau drag &amp; drop gambar
                </p>
                <p style={{ fontSize: 10, color: '#94A3B8', margin: 0 }}>
                  JPG · PNG · WEBP · GIF &nbsp;·&nbsp; Maks 4MB
                </p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      )}

      {/* URL input */}
      {tab === 'url' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => { setUrlInput(e.target.value); setStatus(null) }}
            placeholder="https://contoh.com/gambar.jpg"
            onKeyDown={(e) => e.key === 'Enter' && handleUrlApply()}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid #DBEAFE',
              background: '#F8FAFF',
              fontSize: 12,
              color: '#0A2342',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handleUrlApply}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: 'none',
              background: '#0D47A1',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Terapkan
          </button>
        </div>
      )}

      {/* Status message */}
      {status && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', borderRadius: 8, fontSize: 11,
          background: status.type === 'error' ? '#FEF2F2' : '#F0FDF4',
          color: status.type === 'error' ? '#DC2626' : '#16A34A',
          border: `1px solid ${status.type === 'error' ? '#FECACA' : '#BBF7D0'}`,
        }}>
          {status.type === 'error'
            ? <AlertCircle size={13} />
            : <CheckCircle2 size={13} />
          }
          {status.msg}
        </div>
      )}

      {/* Preview gambar */}
      {value && !imgError ? (
        <div style={{
          position: 'relative', borderRadius: 12, overflow: 'hidden',
          border: '1px solid #DBEAFE', background: '#F8FAFF',
        }}>
          {/* Gambar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }}
            onError={() => setImgError(true)}
          />
          {/* URL info bar */}
          <div style={{
            padding: '6px 10px',
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.95)',
            borderTop: '1px solid #EEF3FC',
          }}>
            <CheckCircle2 size={11} color="#16A34A" style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: 10, color: '#64748B', flex: 1,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {value.startsWith('data:') ? 'Preview lokal (base64)' : value}
            </span>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#0D47A1', flexShrink: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={11} />
            </a>
          </div>
          {/* Tombol hapus */}
          <button
            type="button"
            onClick={handleRemove}
            title="Hapus gambar"
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 26, height: 26, borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              background: 'rgba(0,0,0,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
            }}
          >
            <X size={13} color="white" />
          </button>
        </div>
      ) : value && imgError ? (
        /* Error state saat gambar tidak bisa dimuat */
        <div style={{
          padding: '12px 14px', borderRadius: 10,
          background: '#FFF7ED', border: '1px solid #FED7AA',
          display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <AlertCircle size={14} color="#EA580C" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#C2410C', margin: '0 0 2px' }}>
              Gambar tidak dapat ditampilkan
            </p>
            <p style={{ fontSize: 10, color: '#9A3412', margin: '0 0 6px', wordBreak: 'break-all' }}>
              {value}
            </p>
            <p style={{ fontSize: 10, color: '#9A3412', margin: '0 0 8px' }}>
              Kemungkinan URL tidak valid, gambar dihapus, atau domain diblokir Next.js.
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={handleRemove}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none',
                  background: '#DC2626', color: 'white',
                  fontSize: 10, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Hapus &amp; Ganti
              </button>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '4px 10px', borderRadius: 6,
                  border: '1px solid #FED7AA', background: 'white',
                  color: '#EA580C', fontSize: 10, fontWeight: 700,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3,
                }}
              >
                Buka URL <ExternalLink size={9} />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '16px', borderRadius: 10,
          border: '1px solid #EEF3FC', background: '#FAFBFF',
        }}>
          <ImageIcon size={16} color="#CBD5E1" />
          <span style={{ fontSize: 11, color: '#CBD5E1' }}>Belum ada gambar dipilih</span>
        </div>
      )}

      {/* CSS spin animation */}
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────
// Thumbnail kecil di tabel
// ─────────────────────────────────────────────
function Thumbnail({ src, alt }: { src: string | null; alt: string }) {
  const [err, setErr] = useState(false)
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
      border: '1px solid #EEF3FC', background: '#F1F5F9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {src && !err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setErr(true)}
        />
      ) : (
        <ImageIcon size={16} color="#CBD5E1" />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export default function BeritaPage() {
  const [list, setList]       = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState<Partial<Berita> | null>(null)
  const [search, setSearch]   = useState('')
  const [pending, start]      = useTransition()
  const { show, ToastEl }     = useToast()

  function load() {
    setLoading(true)
    fetch('/api/admin/berita')
      .then((r) => r.json())
      .then((d) => setList(Array.isArray(d) ? d : (d?.data ?? [])))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/berita')
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setList(Array.isArray(d) ? d : (d?.data ?? [])) })
      .catch(() => { if (!cancelled) setList([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filtered = list.filter((b) =>
    b.judul.toLowerCase().includes(search.toLowerCase())
  )

  function openNew() { setForm({ publish: false, tags: [] }) }
  function openEdit(b: Berita) {
    setForm({ ...b })
    // Scroll ke form
    setTimeout(() => {
      document.getElementById('berita-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function handleSave() {
    if (!form?.judul || !form?.slug) return show('Judul dan slug wajib diisi', 'error')
    start(async () => {
      try {
        await upsertBerita({
          id:        form.id,
          judul:     form.judul!,
          slug:      form.slug!,
          konten:    form.konten ?? '',
          ringkasan: form.ringkasan ?? undefined,
          gambar:    form.gambar ?? undefined,
          kategori:  form.kategori ?? undefined,
          penulis:   form.penulis ?? undefined,
          tags:      form.tags ?? [],
          publish:   form.publish ?? false,
        })
        show(form.id ? 'Berita berhasil diperbarui!' : 'Berita berhasil disimpan!')
        setForm(null)
        load()
      } catch {
        show('Terjadi kesalahan saat menyimpan', 'error')
      }
    })
  }

  // Stats
  const totalPublish  = list.filter((b) => b.publish).length
  const totalDraft    = list.filter((b) => !b.publish).length
  const totalViews    = list.reduce((s, b) => s + (b.views || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ToastEl />

      {/* ── Stats bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Berita', value: list.length, icon: <Newspaper size={16} color="#0D47A1" />, color: '#EFF6FF' },
          { label: 'Dipublish', value: totalPublish, icon: <CheckCircle2 size={16} color="#16A34A" />, color: '#F0FDF4' },
          { label: 'Total Views', value: totalViews.toLocaleString('id-ID'), icon: <Eye size={16} color="#9333EA" />, color: '#FAF5FF' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{
            padding: '14px 16px', borderRadius: 14,
            background: 'white', border: '1px solid #EEF3FC',
            boxShadow: '0 1px 8px rgba(13,71,161,.05)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0A2342', lineHeight: 1.1 }}>{value}</p>
              <p style={{ margin: 0, fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabel daftar berita ── */}
      <div style={{
        background: 'white', borderRadius: 16, border: '1px solid #EEF3FC',
        boxShadow: '0 2px 16px rgba(13,71,161,.06)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
          borderBottom: '1px solid #EEF3FC',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0A2342' }}>Daftar Berita</h2>
            <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
              {filtered.length} dari {list.length} berita
              {totalDraft > 0 && ` · ${totalDraft} draft`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 10,
              border: '1px solid #DBEAFE', background: '#F8FAFF',
            }}>
              <Search size={12} color="#94A3B8" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul..."
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 11, color: '#0A2342', width: 140,
                }}
              />
            </div>
            {/* Refresh */}
            <button
              type="button"
              onClick={load}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: '1px solid #DBEAFE', background: '#F8FAFF',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Refresh"
            >
              <RefreshCw size={13} color="#64748B" />
            </button>
            {/* Tambah */}
            <button
              type="button"
              onClick={openNew}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 10,
                border: 'none', background: '#0D47A1', color: 'white',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}
            >
              + Tambah Berita
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <Loader2 size={24} color="#DBEAFE" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>Memuat data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <Newspaper size={36} color="#E2E8F0" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
                {search ? `Tidak ada berita dengan kata "${search}"` : 'Belum ada berita'}
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFBFF' }}>
                  {['Berita', 'Kategori', 'Penulis', 'Tanggal', 'Views', 'Status', 'Aksi'].map((h) => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: 10, fontWeight: 700, color: '#94A3B8',
                      letterSpacing: '.05em', textTransform: 'uppercase',
                      borderBottom: '1px solid #EEF3FC',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFF' : 'none',
                      transition: 'background .1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FAFBFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Berita */}
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Thumbnail src={b.gambar} alt={b.judul} />
                        <div style={{ minWidth: 0 }}>
                          <p style={{
                            margin: 0, fontSize: 12, fontWeight: 700, color: '#0A2342',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            maxWidth: 220,
                          }}>{b.judul}</p>
                          <p style={{
                            margin: '2px 0 0', fontSize: 10, color: '#94A3B8',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            maxWidth: 200,
                          }}>{b.slug}</p>
                        </div>
                      </div>
                    </td>
                    {/* Kategori */}
                    <td style={{ padding: '10px 16px' }}>
                      {b.kategori ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 8px', borderRadius: 6,
                          background: '#EFF6FF', color: '#1D4ED8',
                          fontSize: 10, fontWeight: 700,
                        }}>
                          <Tag size={9} /> {b.kategori}
                        </span>
                      ) : <span style={{ fontSize: 11, color: '#CBD5E1' }}>—</span>}
                    </td>
                    {/* Penulis */}
                    <td style={{ padding: '10px 16px' }}>
                      {b.penulis ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748B' }}>
                          <User size={10} /> {b.penulis}
                        </span>
                      ) : <span style={{ fontSize: 11, color: '#CBD5E1' }}>—</span>}
                    </td>
                    {/* Tanggal */}
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94A3B8' }}>
                        <Calendar size={10} /> {formatTanggal(b.createdAt)}
                      </span>
                    </td>
                    {/* Views */}
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748B' }}>
                        <Eye size={11} /> {(b.views || 0).toLocaleString('id-ID')}
                      </span>
                    </td>
                    {/* Status */}
                    <td style={{ padding: '10px 16px' }}>
                      <button
                        type="button"
                        onClick={() => start(async () => { await togglePublishBerita(b.id, !b.publish); load() })}
                        style={{
                          padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                          fontSize: 10, fontWeight: 700, transition: 'all .15s',
                          background: b.publish ? '#DCFCE7' : '#FEF9C3',
                          color: b.publish ? '#15803D' : '#A16207',
                        }}
                      >
                        {b.publish ? '● Publish' : '○ Draft'}
                      </button>
                    </td>
                    {/* Aksi */}
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => openEdit(b)}
                          style={{
                            padding: '5px 10px', borderRadius: 7, border: '1px solid #DBEAFE',
                            background: '#F0F7FF', color: '#0D47A1',
                            fontSize: 10, fontWeight: 700, cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm(`Hapus berita "${b.judul}"?`)) return
                            await deleteBerita(b.id)
                            load()
                            show('Berita dihapus')
                          }}
                          style={{
                            padding: '5px 10px', borderRadius: 7, border: '1px solid #FECACA',
                            background: '#FFF5F5', color: '#DC2626',
                            fontSize: 10, fontWeight: 700, cursor: 'pointer',
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Form Tambah / Edit ── */}
      {form !== null && (
        <div
          id="berita-form"
          style={{
            background: 'white', borderRadius: 16, border: '1px solid #DBEAFE',
            boxShadow: '0 4px 24px rgba(13,71,161,.10)', overflow: 'hidden',
          }}
        >
          {/* Form header */}
          <div style={{
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid #EEF3FC',
            background: 'linear-gradient(135deg, #0A2342 0%, #0D47A1 100%)',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'white' }}>
                {form.id ? '✏️ Edit Berita' : '✨ Tambah Berita Baru'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
                {form.id ? `Mengedit: ${form.judul}` : 'Isi form di bawah untuk menambah berita'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm(null)}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.15)', color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Form body */}
          <div style={{ padding: 20 }}>
            {/* Row 1: Judul + Slug */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  Judul <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  value={form.judul ?? ''}
                  onChange={(e) => setForm({
                    ...form,
                    judul: e.target.value,
                    slug: form.id ? form.slug : slugify(e.target.value),
                  })}
                  placeholder="Judul berita..."
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box',
                    border: '1px solid #DBEAFE', background: '#F8FAFF',
                    fontSize: 12, color: '#0A2342', outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  Slug <span style={{ color: '#EF4444' }}>*</span>
                  <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 400, marginLeft: 4 }}>otomatis dari judul</span>
                </label>
                <input
                  value={form.slug ?? ''}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="judul-berita"
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box',
                    border: '1px solid #DBEAFE', background: '#F8FAFF',
                    fontSize: 12, color: '#0A2342', outline: 'none', fontFamily: 'monospace',
                  }}
                />
              </div>
            </div>

            {/* Row 2: Kategori + Penulis */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Kategori</label>
                <input
                  value={form.kategori ?? ''}
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                  placeholder="Kegiatan, Pengumuman, ..."
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box',
                    border: '1px solid #DBEAFE', background: '#F8FAFF',
                    fontSize: 12, color: '#0A2342', outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Penulis</label>
                <input
                  value={form.penulis ?? ''}
                  onChange={(e) => setForm({ ...form, penulis: e.target.value })}
                  placeholder="Nama penulis..."
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box',
                    border: '1px solid #DBEAFE', background: '#F8FAFF',
                    fontSize: 12, color: '#0A2342', outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Gambar — full width */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Gambar
                <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 400, marginLeft: 4 }}>
                  upload file atau pakai URL
                </span>
              </label>
              <ImageUploader
                value={form.gambar ?? ''}
                onChange={(url) => setForm({ ...form, gambar: url || null })}
              />
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Tags
                <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 400, marginLeft: 4 }}>pisahkan dengan koma</span>
              </label>
              <input
                value={(form.tags ?? []).join(', ')}
                onChange={(e) => setForm({
                  ...form,
                  tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                })}
                placeholder="organisasi, ntt, kegiatan"
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box',
                  border: '1px solid #DBEAFE', background: '#F8FAFF',
                  fontSize: 12, color: '#0A2342', outline: 'none',
                }}
              />
              {/* Tag preview */}
              {(form.tags ?? []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                  {(form.tags ?? []).map((t) => (
                    <span key={t} style={{
                      padding: '2px 8px', borderRadius: 20,
                      background: '#EFF6FF', color: '#1D4ED8',
                      fontSize: 10, fontWeight: 700,
                    }}>#{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Ringkasan */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Ringkasan</label>
              <textarea
                value={form.ringkasan ?? ''}
                onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
                rows={2}
                placeholder="Ringkasan singkat berita (opsional, tampil di listing)..."
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box',
                  border: '1px solid #DBEAFE', background: '#F8FAFF',
                  fontSize: 12, color: '#0A2342', outline: 'none', resize: 'vertical',
                }}
              />
            </div>

            {/* Konten HTML */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Konten <span style={{ color: '#EF4444' }}>*</span>
                <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 400, marginLeft: 4 }}>format HTML</span>
              </label>
              <textarea
                value={form.konten ?? ''}
                onChange={(e) => setForm({ ...form, konten: e.target.value })}
                rows={10}
                placeholder="<p>Isi konten berita di sini...</p>"
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10, boxSizing: 'border-box',
                  border: '1px solid #DBEAFE', background: '#0A2342',
                  fontSize: 11, color: '#93C5FD', outline: 'none',
                  resize: 'vertical', fontFamily: "'Fira Code', 'Courier New', monospace",
                  lineHeight: 1.6,
                }}
              />
            </div>

            {/* Publish toggle */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
              background: form.publish ? '#F0FDF4' : '#F8FAFF',
              border: `1px solid ${form.publish ? '#BBF7D0' : '#DBEAFE'}`,
              transition: 'all .2s',
            }}>
              <input
                type="checkbox"
                checked={form.publish ?? false}
                onChange={(e) => setForm({ ...form, publish: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: '#16A34A' }}
              />
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: form.publish ? '#15803D' : '#374151' }}>
                  {form.publish ? '✅ Berita akan dipublikasikan' : '📝 Simpan sebagai draft'}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: '#94A3B8', marginTop: 1 }}>
                  {form.publish
                    ? 'Berita langsung tampil di halaman publik setelah disimpan'
                    : 'Berita hanya terlihat di admin, belum tampil di publik'}
                </p>
              </div>
            </label>
          </div>

          {/* Form footer */}
          <div style={{
            padding: '14px 20px',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            borderTop: '1px solid #EEF3FC', background: '#FAFBFF',
          }}>
            <button
              type="button"
              onClick={() => setForm(null)}
              style={{
                padding: '8px 18px', borderRadius: 10,
                border: '1px solid #DBEAFE', background: 'white',
                fontSize: 12, fontWeight: 700, color: '#64748B', cursor: 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              style={{
                padding: '8px 20px', borderRadius: 10, border: 'none',
                background: pending ? '#93C5FD' : '#0D47A1',
                color: 'white', fontSize: 12, fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all .15s',
              }}
            >
              {pending && <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />}
              {form.id ? 'Simpan Perubahan' : 'Tambah Berita'}
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}