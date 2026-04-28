'use client'
// app/components/(admin)/situs-terkait/_SitusTerkaitPage.tsx

import { useEffect, useState, useTransition, useRef, useCallback } from 'react'
import { useToast } from '@/components/admin/AdminUI'
import {
  upsertSitusTerkait,
  deleteSitusTerkait,
  toggleAktifSitusTerkait,
  updateUrutanSitusTerkait,
} from '@/actions/situs-terkait'
import { useUploadThing } from '@/lib/uploadthing-client'
import {
  Globe, Plus, Search, RefreshCw, Upload, Link2, X, Loader2,
  ImageIcon, CheckCircle2, AlertCircle, FileImage, ExternalLink,
  GripVertical, Eye, EyeOff, Trash2, Pencil, ChevronUp, ChevronDown,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type SitusTerkait = {
  id:        string
  label:     string
  href:      string
  external:  boolean
  thumbnail: string[]
  favicon:   string | null
  aktif:     boolean
  urutan:    number
  createdAt: string
}

// ─── ImageUploader (thumbnail tunggal) ───────────────────────────────────────
function ThumbnailUploader({
  value,
  onChange,
  index,
}: {
  value: string
  onChange: (url: string) => void
  index: number
}) {
  const [tab, setTab]       = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrl]  = useState('')
  const [dragging, setDrag] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const [status, setStatus] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const inputRef            = useRef<HTMLInputElement>(null)

  useEffect(() => { setImgErr(false) }, [value])

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl ?? res?.[0]?.url
      if (url) { onChange(url); setStatus({ type: 'success', msg: 'Gambar berhasil diupload!' }) }
      else setStatus({ type: 'error', msg: 'Upload selesai tapi URL tidak ditemukan.' })
    },
    onUploadError: (err) => setStatus({ type: 'error', msg: `Upload gagal: ${err.message}` }),
  })

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return setStatus({ type: 'error', msg: 'File harus gambar' })
    if (file.size > 4 * 1024 * 1024) return setStatus({ type: 'error', msg: 'Maks 4MB' })
    setStatus(null)
    await startUpload([file])
  }, [startUpload])

  const applyUrl = () => {
    const u = urlInput.trim()
    if (!u) return setStatus({ type: 'error', msg: 'URL kosong' })
    if (!u.startsWith('http')) return setStatus({ type: 'error', msg: 'URL harus diawali https://' })
    onChange(u); setUrl(''); setStatus({ type: 'success', msg: 'URL diterapkan!' })
  }

  return (
    <div style={{ border: '1px solid #DBEAFE', borderRadius: 12, padding: 12, background: '#F8FAFF', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#374151' }}>Slide {index + 1}</span>
        {value && (
          <button type="button" onClick={() => { onChange(''); setStatus(null) }}
            style={{ padding: '2px 8px', borderRadius: 6, border: 'none', background: '#FEE2E2', color: '#DC2626', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>
            Hapus Slide
          </button>
        )}
      </div>

      {/* Tab */}
      <div style={{ display: 'flex', gap: 3, padding: 3, background: '#EEF3FC', borderRadius: 8 }}>
        {(['upload', 'url'] as const).map((t) => (
          <button key={t} type="button" onClick={() => { setTab(t); setStatus(null) }} style={{
            flex: 1, padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 10, fontWeight: 700, transition: 'all .15s',
            background: tab === t ? 'white' : 'transparent',
            color: tab === t ? '#0D47A1' : '#94A3B8',
            boxShadow: tab === t ? '0 1px 4px rgba(13,71,161,.12)' : 'none',
          }}>
            {t === 'upload' ? <><Upload size={9} style={{ display: 'inline', marginRight: 3 }} />Upload</> : <><Link2 size={9} style={{ display: 'inline', marginRight: 3 }} />URL</>}
          </button>
        ))}
      </div>

      {tab === 'upload' && (
        <div
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f) }}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onClick={() => !isUploading && inputRef.current?.click()}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px 12px', border: `2px dashed ${dragging ? '#1D4ED8' : '#BFDBFE'}`, borderRadius: 10, background: dragging ? '#EFF6FF' : isUploading ? '#F0FDF4' : 'white', cursor: isUploading ? 'not-allowed' : 'pointer', minHeight: 70 }}>
          {isUploading
            ? <><Loader2 size={18} color="#1D4ED8" style={{ animation: 'spin 1s linear infinite' }} /><span style={{ fontSize: 10, color: '#1D4ED8', fontWeight: 700 }}>Mengupload...</span></>
            : dragging
              ? <><FileImage size={20} color="#1D4ED8" /><span style={{ fontSize: 10, color: '#1D4ED8', fontWeight: 700 }}>Lepaskan!</span></>
              : <><Upload size={18} color="#94A3B8" /><span style={{ fontSize: 10, color: '#94A3B8' }}>Klik / drag gambar · Maks 4MB</span></>
          }
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = '' }} disabled={isUploading} />
        </div>
      )}

      {tab === 'url' && (
        <div style={{ display: 'flex', gap: 6 }}>
          <input type="text" value={urlInput} onChange={(e) => { setUrl(e.target.value); setStatus(null) }} placeholder="https://..." onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
            style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1px solid #DBEAFE', background: 'white', fontSize: 11, outline: 'none' }} />
          <button type="button" onClick={applyUrl} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#0D47A1', color: 'white', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>OK</button>
        </div>
      )}

      {status && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 7, fontSize: 10, background: status.type === 'error' ? '#FEF2F2' : '#F0FDF4', color: status.type === 'error' ? '#DC2626' : '#16A34A', border: `1px solid ${status.type === 'error' ? '#FECACA' : '#BBF7D0'}` }}>
          {status.type === 'error' ? <AlertCircle size={11} /> : <CheckCircle2 size={11} />}
          {status.msg}
        </div>
      )}

      {/* Preview */}
      {value && !imgErr && (
        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #DBEAFE' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={`slide-${index}`} style={{ width: '100%', maxHeight: 100, objectFit: 'cover', display: 'block' }} onError={() => setImgErr(true)} />
        </div>
      )}
      {value && imgErr && (
        <div style={{ padding: '8px 10px', borderRadius: 8, background: '#FFF7ED', border: '1px solid #FED7AA', fontSize: 10, color: '#C2410C' }}>
          <AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />
          Gambar tidak dapat dimuat
        </div>
      )}
      {!value && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, borderRadius: 8, border: '1px dashed #E2E8F0', background: 'white' }}>
          <ImageIcon size={14} color="#CBD5E1" /><span style={{ fontSize: 10, color: '#CBD5E1' }}>Belum ada gambar</span>
        </div>
      )}
    </div>
  )
}

// ─── Form state awal ──────────────────────────────────────────────────────────
const emptyForm = (): Partial<SitusTerkait> => ({
  label: '', href: '', external: true, thumbnail: [], favicon: '', aktif: true, urutan: 0,
})

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SitusTerkaitPage() {
  const [list, setList]       = useState<SitusTerkait[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState<Partial<SitusTerkait> | null>(null)
  const [search, setSearch]   = useState('')
  const [pending, start]      = useTransition()
  const { show, ToastEl }     = useToast()

  // ── Load data ──────────────────────────────────────────────────────────────
  function load() {
    setLoading(true)
    fetch('/api/admin/situs-terkait')
      .then((r) => r.json())
      .then((d) => setList(Array.isArray(d) ? d : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const filtered = list.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase()) ||
    s.href.toLowerCase().includes(search.toLowerCase())
  )

  // ── Helpers ────────────────────────────────────────────────────────────────
  function openNew() {
    setForm(emptyForm())
    setTimeout(() => document.getElementById('situs-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }
  function openEdit(s: SitusTerkait) {
    setForm({ ...s })
    setTimeout(() => document.getElementById('situs-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  // Thumbnail management dalam form
  function setThumb(idx: number, url: string) {
    const arr = [...(form?.thumbnail ?? [])]
    arr[idx] = url
    setForm({ ...form, thumbnail: arr })
  }
  function addThumbSlot() {
    setForm({ ...form, thumbnail: [...(form?.thumbnail ?? []), ''] })
  }
  function removeThumb(idx: number) {
    const arr = [...(form?.thumbnail ?? [])]
    arr.splice(idx, 1)
    setForm({ ...form, thumbnail: arr })
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  function handleSave() {
    if (!form?.label?.trim()) return show('Label wajib diisi', 'error')
    if (!form?.href?.trim())  return show('URL/Link wajib diisi', 'error')

    start(async () => {
      try {
        await upsertSitusTerkait({
          id:        form.id,
          label:     form.label!,
          href:      form.href!,
          external:  form.external ?? true,
          thumbnail: (form.thumbnail ?? []).filter(Boolean),
          favicon:   form.favicon ?? undefined,
          aktif:     form.aktif ?? true,
          urutan:    form.urutan ?? 0,
        })
        show(form.id ? 'Berhasil diperbarui!' : 'Berhasil ditambahkan!')
        setForm(null)
        load()
      } catch {
        show('Terjadi kesalahan saat menyimpan', 'error')
      }
    })
  }

  // ── Move urutan ────────────────────────────────────────────────────────────
  function moveItem(idx: number, dir: -1 | 1) {
    const newList = [...list]
    const target  = idx + dir
    if (target < 0 || target >= newList.length) return
    ;[newList[idx], newList[target]] = [newList[target], newList[idx]]
    const updated = newList.map((item, i) => ({ id: item.id, urutan: i }))
    setList(newList.map((item, i) => ({ ...item, urutan: i })))
    start(async () => {
      await updateUrutanSitusTerkait(updated)
    })
  }

  const totalAktif = list.filter((s) => s.aktif).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ToastEl />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Total Aplikasi', value: list.length, icon: <Globe size={16} color="#0D47A1" />, bg: '#EFF6FF' },
          { label: 'Aktif Tampil',   value: totalAktif,  icon: <Eye size={16} color="#16A34A" />, bg: '#F0FDF4' },
          { label: 'Non-aktif',      value: list.length - totalAktif, icon: <EyeOff size={16} color="#9333EA" />, bg: '#FAF5FF' },
        ].map(({ label, value, icon, bg }) => (
          <div key={label} style={{ padding: '14px 16px', borderRadius: 14, background: 'white', border: '1px solid #EEF3FC', boxShadow: '0 1px 8px rgba(13,71,161,.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
            <div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0A2342', lineHeight: 1.1 }}>{value}</p>
              <p style={{ margin: 0, fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabel ── */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #EEF3FC', boxShadow: '0 2px 16px rgba(13,71,161,.06)', overflow: 'hidden' }}>
        {/* Header tabel */}
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid #EEF3FC' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0A2342' }}>Daftar Aplikasi / Situs Terkait</h2>
            <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{filtered.length} dari {list.length} entri</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, border: '1px solid #DBEAFE', background: '#F8FAFF' }}>
              <Search size={12} color="#94A3B8" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari label / URL..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 11, color: '#0A2342', width: 140 }} />
            </div>
            <button type="button" onClick={load} title="Refresh" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #DBEAFE', background: '#F8FAFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={13} color="#64748B" />
            </button>
            <button type="button" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: 'none', background: '#0D47A1', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={12} /> Tambah Aplikasi
            </button>
          </div>
        </div>

        {/* Body tabel */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <Loader2 size={24} color="#DBEAFE" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>Memuat data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <Globe size={36} color="#E2E8F0" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
                {search ? `Tidak ada hasil "${search}"` : 'Belum ada data. Klik "+ Tambah Aplikasi" untuk mulai.'}
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFBFF' }}>
                  {['Urutan', 'Thumbnail', 'Label & URL', 'Slide', 'Status', 'Aksi'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '.05em', textTransform: 'uppercase', borderBottom: '1px solid #EEF3FC' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const realIdx = list.findIndex((x) => x.id === s.id)
                  return (
                    <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFF' : 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAFBFF')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>

                      {/* Urutan */}
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <button type="button" onClick={() => moveItem(realIdx, -1)} disabled={realIdx === 0} title="Naik"
                            style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid #DBEAFE', background: realIdx === 0 ? '#F8FAFF' : '#EFF6FF', cursor: realIdx === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: realIdx === 0 ? 0.4 : 1 }}>
                            <ChevronUp size={12} color="#0D47A1" />
                          </button>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8' }}>{s.urutan}</span>
                          <button type="button" onClick={() => moveItem(realIdx, 1)} disabled={realIdx === list.length - 1} title="Turun"
                            style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid #DBEAFE', background: realIdx === list.length - 1 ? '#F8FAFF' : '#EFF6FF', cursor: realIdx === list.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: realIdx === list.length - 1 ? 0.4 : 1 }}>
                            <ChevronDown size={12} color="#0D47A1" />
                          </button>
                        </div>
                      </td>

                      {/* Thumbnail preview */}
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ width: 56, height: 40, borderRadius: 8, overflow: 'hidden', border: '1px solid #EEF3FC', background: '#F1F5F9', position: 'relative', flexShrink: 0 }}>
                          {s.thumbnail?.[0]
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={s.thumbnail[0]} alt={s.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={14} color="#CBD5E1" /></div>
                          }
                          {s.thumbnail.length > 1 && (
                            <div style={{ position: 'absolute', bottom: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 3 }}>
                              {s.thumbnail.length}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Label & URL */}
                      <td style={{ padding: '10px 16px' }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#0A2342' }}>{s.label}</p>
                        <a href={s.href} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                          <ExternalLink size={9} />
                          <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.href}</span>
                        </a>
                      </td>

                      {/* Jumlah slide */}
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: 6, background: '#EFF6FF', color: '#1D4ED8', fontSize: 10, fontWeight: 700 }}>
                          {s.thumbnail.length} slide
                        </span>
                      </td>

                      {/* Status toggle */}
                      <td style={{ padding: '10px 16px' }}>
                        <button type="button"
                          onClick={() => start(async () => { await toggleAktifSitusTerkait(s.id, !s.aktif); load() })}
                          style={{ padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, background: s.aktif ? '#DCFCE7' : '#FEF9C3', color: s.aktif ? '#15803D' : '#A16207' }}>
                          {s.aktif ? '● Aktif' : '○ Non-aktif'}
                        </button>
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button type="button" onClick={() => openEdit(s)}
                            style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid #DBEAFE', background: '#F0F7FF', color: '#0D47A1', fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Pencil size={10} /> Edit
                          </button>
                          <button type="button"
                            onClick={async () => {
                              if (!confirm(`Hapus "${s.label}"?`)) return
                              await deleteSitusTerkait(s.id)
                              load()
                              show(`"${s.label}" dihapus`)
                            }}
                            style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid #FECACA', background: '#FFF5F5', color: '#DC2626', fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Trash2 size={10} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Form Tambah / Edit ── */}
      {form !== null && (
        <div id="situs-form" style={{ background: 'white', borderRadius: 16, border: '1px solid #DBEAFE', boxShadow: '0 4px 24px rgba(13,71,161,.10)', overflow: 'hidden' }}>

          {/* Header form */}
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EEF3FC', background: 'linear-gradient(135deg,#0A2342 0%,#0D47A1 100%)' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'white' }}>
                {form.id ? '✏️ Edit Aplikasi' : '✨ Tambah Aplikasi Baru'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
                {form.id ? `Mengedit: ${form.label}` : 'Isi form di bawah ini'}
              </p>
            </div>
            <button type="button" onClick={() => setForm(null)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Label + URL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  Label / Nama Aplikasi <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  value={form.label ?? ''}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="G-SINJAB, SiMBAGA NTT..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box', border: '1px solid #DBEAFE', background: '#F8FAFF', fontSize: 12, color: '#0A2342', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  URL / Link <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  value={form.href ?? ''}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box', border: '1px solid #DBEAFE', background: '#F8FAFF', fontSize: 12, color: '#0A2342', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* Favicon + Urutan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  Favicon URL <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 400 }}>opsional · ikon kecil aplikasi</span>
                </label>
                <input
                  value={form.favicon ?? ''}
                  onChange={(e) => setForm({ ...form, favicon: e.target.value })}
                  placeholder="https://contoh.com/favicon.ico"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box', border: '1px solid #DBEAFE', background: '#F8FAFF', fontSize: 12, color: '#0A2342', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Urutan</label>
                <input
                  type="number" min={0}
                  value={form.urutan ?? 0}
                  onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })}
                  style={{ width: 80, padding: '8px 12px', borderRadius: 10, border: '1px solid #DBEAFE', background: '#F8FAFF', fontSize: 12, color: '#0A2342', outline: 'none' }}
                />
              </div>
            </div>

            {/* Thumbnail slides */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>
                  Thumbnail / Screenshot
                  <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 400, marginLeft: 4 }}>
                    1 gambar = static · 2+ gambar = auto-slide
                  </span>
                </label>
                <button type="button" onClick={addThumbSlot}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 7, border: '1px solid #DBEAFE', background: '#F0F7FF', color: '#0D47A1', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={10} /> Tambah Slide
                </button>
              </div>

              {(form.thumbnail ?? []).length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '20px 16px', borderRadius: 10, border: '2px dashed #DBEAFE', background: '#F8FAFF' }}>
                  <ImageIcon size={18} color="#CBD5E1" />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 11, color: '#CBD5E1', fontWeight: 600 }}>Belum ada thumbnail</p>
                    <p style={{ margin: '2px 0 0', fontSize: 10, color: '#CBD5E1' }}>Klik &quot;+ Tambah Slide&quot; untuk menambah gambar</p>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {(form.thumbnail ?? []).map((thumb, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <ThumbnailUploader
                      value={thumb}
                      onChange={(url) => {
                        if (!url) { removeThumb(idx); return }
                        setThumb(idx, url)
                      }}
                      index={idx}
                    />
                  </div>
                ))}
              </div>

              {(form.thumbnail ?? []).length > 1 && (
                <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #DBEAFE', fontSize: 10, color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <GripVertical size={11} />
                  {(form.thumbnail ?? []).filter(Boolean).length} slide aktif — akan tampil sebagai auto-slideshow di halaman publik
                </div>
              )}
            </div>

            {/* Toggles: external + aktif */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* External toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, cursor: 'pointer', background: form.external ? '#EFF6FF' : '#F8FAFF', border: `1px solid ${form.external ? '#BFDBFE' : '#DBEAFE'}`, transition: 'all .2s' }}>
                <input type="checkbox" checked={form.external ?? true} onChange={(e) => setForm({ ...form, external: e.target.checked })} style={{ width: 15, height: 15, accentColor: '#0D47A1' }} />
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: form.external ? '#1D4ED8' : '#374151' }}>
                    {form.external ? '🔗 Buka tab baru' : '📄 Buka di tab sama'}
                  </p>
                  <p style={{ margin: 0, fontSize: 9, color: '#94A3B8', marginTop: 1 }}>Link eksternal</p>
                </div>
              </label>

              {/* Aktif toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, cursor: 'pointer', background: form.aktif ? '#F0FDF4' : '#F8FAFF', border: `1px solid ${form.aktif ? '#BBF7D0' : '#DBEAFE'}`, transition: 'all .2s' }}>
                <input type="checkbox" checked={form.aktif ?? true} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} style={{ width: 15, height: 15, accentColor: '#16A34A' }} />
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: form.aktif ? '#15803D' : '#374151' }}>
                    {form.aktif ? '✅ Tampil di publik' : '🙈 Disembunyikan'}
                  </p>
                  <p style={{ margin: 0, fontSize: 9, color: '#94A3B8', marginTop: 1 }}>Status tampil</p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer form */}
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #EEF3FC', background: '#FAFBFF' }}>
            <button type="button" onClick={() => setForm(null)} style={{ padding: '8px 18px', borderRadius: 10, border: '1px solid #DBEAFE', background: 'white', fontSize: 12, fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>
              Batal
            </button>
            <button type="button" onClick={handleSave} disabled={pending} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: pending ? '#93C5FD' : '#0D47A1', color: 'white', fontSize: 12, fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {pending && <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />}
              {form.id ? 'Simpan Perubahan' : 'Tambah Aplikasi'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}