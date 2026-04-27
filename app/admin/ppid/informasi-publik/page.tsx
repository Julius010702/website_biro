'use client'
// app/(admin)/admin/ppid/informasi-publik/page.tsx

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, GripVertical,
  X, FileText, ImageIcon, Layers,
  ExternalLink, Save, RefreshCw,
} from 'lucide-react'

/* ── Types ── */
interface InformasiItem {
  id:          string
  judul:       string
  deskripsi:   string | null
  kategori:    string | null
  tipe:        'GAMBAR' | 'DOKUMEN' | 'GAMBAR_DOKUMEN'
  url:         string | null
  urlDokumen:  string | null
  urutan:      number
  aktif:       boolean
  createdAt:   string
}

const TIPE_OPTIONS = [
  { value: 'GAMBAR'         as TipeValue, label: 'Gambar',           icon: <ImageIcon className="w-4 h-4" /> },
  { value: 'DOKUMEN'        as TipeValue, label: 'Dokumen',          icon: <FileText  className="w-4 h-4" /> },
  { value: 'GAMBAR_DOKUMEN' as TipeValue, label: 'Gambar + Dokumen', icon: <Layers    className="w-4 h-4" /> },
]

type TipeValue = 'GAMBAR' | 'DOKUMEN' | 'GAMBAR_DOKUMEN'

const emptyForm: {
  judul:      string
  deskripsi:  string
  kategori:   string
  tipe:       TipeValue
  url:        string
  urlDokumen: string
  urutan:     number
  aktif:      boolean
} = {
  judul:      '',
  deskripsi:  '',
  kategori:   '',
  tipe:       'GAMBAR',
  url:        '',
  urlDokumen: '',
  urutan:     0,
  aktif:      true,
}

/* ══════════════════════════════════════════ */
export default function AdminInformasiPublikPage() {
  const [list,      setList]      = useState<InformasiItem[]>([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [editItem,  setEditItem]  = useState<InformasiItem | null>(null)
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState(emptyForm)
  const [msg,       setMsg]       = useState({ type: '', text: '' })
  const [search,    setSearch]    = useState('')
  const [filterTipe, setFilterTipe] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  /* kategori unik untuk filter */
  const kategoriList = Array.from(new Set(list.map(i => i.kategori).filter(Boolean))) as string[]

  function load() {
    setLoading(true)
    fetch('/api/admin/informasi-publik')
      .then(r => r.json())
      .then(d => setList(d.data || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (editItem) {
      setForm({
        judul:      editItem.judul,
        deskripsi:  editItem.deskripsi  || '',
        kategori:   editItem.kategori   || '',
        tipe:       editItem.tipe as TipeValue,
        url:        editItem.url        || '',
        urlDokumen: editItem.urlDokumen || '',
        urutan:     editItem.urutan,
        aktif:      editItem.aktif,
      })
      setShowForm(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [editItem])

  function resetForm() {
    setForm(emptyForm)
    setEditItem(null)
    setShowForm(false)
    setMsg({ type: '', text: '' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.judul.trim()) { setMsg({ type: 'error', text: 'Judul wajib diisi' }); return }

    setSaving(true)
    setMsg({ type: '', text: '' })
    try {
      const url    = editItem ? `/api/admin/informasi-publik/${editItem.id}` : '/api/admin/informasi-publik'
      const method = editItem ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setMsg({ type: 'error', text: data.error || 'Gagal menyimpan' }); return }
      setMsg({ type: 'success', text: editItem ? 'Data diperbarui!' : 'Data berhasil ditambahkan!' })
      resetForm()
      load()
    } catch {
      setMsg({ type: 'error', text: 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(item: InformasiItem) {
    if (!confirm(`Hapus item ini?`)) return
    await fetch(`/api/admin/informasi-publik/${item.id}`, { method: 'DELETE' })
    load()
  }

  async function toggleAktif(item: InformasiItem) {
    await fetch(`/api/admin/informasi-publik/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aktif: !item.aktif }),
    })
    load()
  }

  const filtered = list.filter(i => {
    const matchSearch = i.judul.toLowerCase().includes(search.toLowerCase())
    const matchTipe   = filterTipe ? i.tipe === filterTipe : true
    return matchSearch && matchTipe
  })

  /* ── Render ── */
  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kelola Informasi Publik</h2>
          <p className="text-sm text-gray-500 mt-0.5">Tambah, edit, dan kelola konten halaman Informasi Publik PPID.</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/ppid/informasi-publik"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Lihat Halaman
          </a>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Item
          </button>
        </div>
      </div>

      {/* Alert */}
      {msg.text && (
        <div className={`rounded-xl px-4 py-3 text-sm border flex items-start gap-2 ${
          msg.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <span className="mt-0.5 shrink-0">{msg.type === 'success' ? '✓' : '⚠'}</span>
          {msg.text}
          <button onClick={() => setMsg({ type: '', text: '' })} className="ml-auto shrink-0">
            <X className="w-4 h-4 opacity-50 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* ── Form Tambah / Edit ── */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className={`px-5 py-3.5 border-b border-gray-100 flex items-center justify-between ${editItem ? 'bg-amber-50' : 'bg-gray-50/70'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${editItem ? 'bg-amber-100' : 'bg-blue-700'}`}>
                {editItem
                  ? <Pencil className="w-3 h-3 text-amber-700" />
                  : <Plus   className="w-3 h-3 text-white" />
                }
              </div>
              <h3 className="text-sm font-semibold text-gray-800">
                {editItem ? `Edit: ${editItem.judul}` : 'Tambah Item Baru'}
              </h3>
            </div>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">

              {/* Judul */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.judul}
                  onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
                  placeholder="Contoh: Jadwal Pelayanan Informasi Publik"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kategori</label>
                <input
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.kategori}
                  onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                  placeholder="Contoh: Pelayanan, SOP, Alur"
                  list="kategori-list"
                />
                <datalist id="kategori-list">
                  {kategoriList.map(k => <option key={k} value={k} />)}
                </datalist>
              </div>

              {/* Urutan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Urutan Tampil</label>
                <input
                  type="number" min={0}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.urutan}
                  onChange={e => setForm(f => ({ ...f, urutan: +e.target.value }))}
                />
              </div>

              {/* Tipe */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tipe Konten</label>
                <div className="flex gap-2 flex-wrap">
                  {TIPE_OPTIONS.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, tipe: t.value }))}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                        form.tipe === t.value
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Gambar — jika tipe GAMBAR atau GAMBAR_DOKUMEN */}
              {(form.tipe === 'GAMBAR' || form.tipe === 'GAMBAR_DOKUMEN') && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    URL Gambar
                    <span className="ml-1 text-gray-400 font-normal">(link langsung ke file gambar)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={form.url}
                      onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                      placeholder="https://drive.google.com/... atau /uploads/gambar.png"
                    />
                    {form.url && (
                      <button
                        type="button"
                        onClick={() => setPreviewUrl(form.url)}
                        className="shrink-0 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-xs text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        Preview
                      </button>
                    )}
                  </div>
                  {/* Mini preview */}
                  {form.url && (
                    <div className="mt-2 relative w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50" style={{ height: 120 }}>
                      <Image src={form.url} alt="preview" fill className="object-contain p-2"
                        onError={() => {}} sizes="400px" />
                    </div>
                  )}
                </div>
              )}

              {/* URL Dokumen — jika tipe DOKUMEN atau GAMBAR_DOKUMEN */}
              {(form.tipe === 'DOKUMEN' || form.tipe === 'GAMBAR_DOKUMEN') && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    URL Dokumen
                    <span className="ml-1 text-gray-400 font-normal">(PDF, Word, dsb.)</span>
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={form.urlDokumen}
                    onChange={e => setForm(f => ({ ...f, urlDokumen: e.target.value }))}
                    placeholder="https://drive.google.com/... atau /uploads/dokumen.pdf"
                  />
                </div>
              )}

              {/* Deskripsi */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  value={form.deskripsi}
                  onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                  placeholder="Keterangan singkat (opsional)"
                />
              </div>

              {/* Aktif toggle */}
              <div className="sm:col-span-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, aktif: !f.aktif }))}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${form.aktif ? 'bg-blue-700' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.aktif ? 'translate-x-4' : ''}`} />
                </button>
                <span className="text-sm text-gray-700">Tampilkan di halaman publik</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 transition-colors disabled:opacity-60"
              >
                {saving
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan...</>
                  : <><Save className="w-4 h-4" /> {editItem ? 'Perbarui' : 'Simpan'}</>
                }
              </button>
              <button type="button" onClick={resetForm}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter & Search ── */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Cari judul..."
          className="flex-1 min-w-48 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={filterTipe}
          onChange={e => setFilterTipe(e.target.value)}
        >
          <option value="">Semua Tipe</option>
          {TIPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* ── Daftar Item ── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            Daftar Item
            <span className="ml-2 text-xs font-normal text-gray-400">({filtered.length} item)</span>
          </h3>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Memuat...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400">Tidak ada item. Klik &ldquo;Tambah Item&rdquo; untuk memulai.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <div key={item.id} className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50/80 transition-colors ${!item.aktif ? 'opacity-50' : ''}`}>

                {/* Drag handle */}
                <GripVertical className="w-4 h-4 text-gray-300 shrink-0 mt-1 cursor-grab" />

                {/* Thumbnail */}
                {item.tipe !== 'DOKUMEN' && item.url ? (
                  <div
                    className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50 relative cursor-pointer"
                    onClick={() => setPreviewUrl(item.url)}
                  >
                    <Image src={item.url} alt={item.judul} fill className="object-cover" sizes="64px" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-300" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.judul}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      item.tipe === 'GAMBAR'         ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      item.tipe === 'DOKUMEN'        ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                       'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {TIPE_OPTIONS.find(t => t.value === item.tipe)?.label}
                    </span>
                    {item.kategori && (
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.kategori}</span>
                    )}
                  </div>
                  {item.deskripsi && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{item.deskripsi}</p>
                  )}
                  <p className="text-[10px] text-gray-300 mt-1">Urutan: {item.urutan}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleAktif(item)}
                    title={item.aktif ? 'Sembunyikan' : 'Tampilkan'}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                  >
                    {item.aktif ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditItem(item)}
                    title="Edit"
                    className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-500 hover:text-blue-700"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    title="Hapus"
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Preview Gambar ── */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[80vh] rounded-2xl overflow-hidden bg-white"
            onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-full" style={{ minHeight: 300 }}>
              <Image src={previewUrl} alt="preview" fill className="object-contain p-4" sizes="800px" />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}