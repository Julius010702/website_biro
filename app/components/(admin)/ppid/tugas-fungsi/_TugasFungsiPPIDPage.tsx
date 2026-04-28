'use client'
// app/components/(admin)/ppid/tugas-fungsi/_TugasFungsiPPIDPage.tsx

import { useEffect, useState, useTransition } from 'react'
import { useToast } from '@/components/admin/AdminUI'
import {
  Plus, Search, RefreshCw, Loader2, Trash2, Pencil,
  ChevronUp, ChevronDown, X, FileText, GripVertical,
} from 'lucide-react'

type TugasFungsi = {
  id:     string
  judul:  string
  konten: string
  urutan: number
}

const emptyForm = (): Partial<TugasFungsi> => ({ judul: '', konten: '', urutan: 0 })

export default function TugasFungsiPPIDPage() {
  const [list, setList]       = useState<TugasFungsi[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState<Partial<TugasFungsi> | null>(null)
  const [search, setSearch]   = useState('')
  const [pending, start]      = useTransition()
  const { show, ToastEl }     = useToast()

  // ── Load ──────────────────────────────────────────────────────────────────
  function load() {
    setLoading(true)
    fetch('/api/admin/ppid/tugas-fungsi')
      .then((r) => r.json())
      .then((d) => setList(Array.isArray(d) ? d : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const filtered = list.filter((t) =>
    t.judul.toLowerCase().includes(search.toLowerCase()) ||
    t.konten.toLowerCase().includes(search.toLowerCase())
  )

  // ── Save ──────────────────────────────────────────────────────────────────
  function handleSave() {
    if (!form?.judul?.trim())  return show('Judul wajib diisi', 'error')
    if (!form?.konten?.trim()) return show('Konten wajib diisi', 'error')

    start(async () => {
      try {
        const method = form.id ? 'PUT' : 'POST'
        const res = await fetch('/api/admin/ppid/tugas-fungsi', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        show(form.id ? 'Berhasil diperbarui!' : 'Berhasil ditambahkan!')
        setForm(null)
        load()
      } catch {
        show('Terjadi kesalahan saat menyimpan', 'error')
      }
    })
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(item: TugasFungsi) {
    if (!confirm(`Hapus "${item.judul}"?`)) return
    await fetch(`/api/admin/ppid/tugas-fungsi?id=${item.id}`, { method: 'DELETE' })
    show(`"${item.judul}" dihapus`)
    load()
  }

  // ── Move urutan ───────────────────────────────────────────────────────────
  function moveItem(idx: number, dir: -1 | 1) {
    const newList = [...list]
    const target  = idx + dir
    if (target < 0 || target >= newList.length) return
    ;[newList[idx], newList[target]] = [newList[target], newList[idx]]
    const updated = newList.map((item, i) => ({ ...item, urutan: i }))
    setList(updated)
    start(async () => {
      await Promise.all(
        updated.map((item) =>
          fetch('/api/admin/ppid/tugas-fungsi', {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ id: item.id, urutan: item.urutan }),
          })
        )
      )
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ToastEl />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Tabel ── */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #EEF3FC', boxShadow: '0 2px 16px rgba(13,71,161,.06)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid #EEF3FC' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0A2342' }}>Tugas dan Fungsi PPID</h2>
            <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{filtered.length} dari {list.length} entri</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, border: '1px solid #DBEAFE', background: '#F8FAFF' }}>
              <Search size={12} color="#94A3B8" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 11, color: '#0A2342', width: 140 }} />
            </div>
            <button type="button" onClick={load} title="Refresh" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #DBEAFE', background: '#F8FAFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={13} color="#64748B" />
            </button>
            <button type="button" onClick={() => { setForm(emptyForm()); setTimeout(() => document.getElementById('tf-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100) }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: 'none', background: '#0D47A1', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={12} /> Tambah
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <Loader2 size={24} color="#DBEAFE" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>Memuat data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <FileText size={36} color="#E2E8F0" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
                {search ? `Tidak ada hasil "${search}"` : 'Belum ada data. Klik "+ Tambah" untuk mulai.'}
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFBFF' }}>
                  {['Urutan', 'Judul', 'Konten (Ringkas)', 'Aksi'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '.05em', textTransform: 'uppercase', borderBottom: '1px solid #EEF3FC' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const realIdx = list.findIndex((x) => x.id === item.id)
                  return (
                    <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFF' : 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAFBFF')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>

                      {/* Urutan */}
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <button type="button" onClick={() => moveItem(realIdx, -1)} disabled={realIdx === 0}
                            style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid #DBEAFE', background: realIdx === 0 ? '#F8FAFF' : '#EFF6FF', cursor: realIdx === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: realIdx === 0 ? 0.4 : 1 }}>
                            <ChevronUp size={12} color="#0D47A1" />
                          </button>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8' }}>{item.urutan}</span>
                          <button type="button" onClick={() => moveItem(realIdx, 1)} disabled={realIdx === list.length - 1}
                            style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid #DBEAFE', background: realIdx === list.length - 1 ? '#F8FAFF' : '#EFF6FF', cursor: realIdx === list.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: realIdx === list.length - 1 ? 0.4 : 1 }}>
                            <ChevronDown size={12} color="#0D47A1" />
                          </button>
                        </div>
                      </td>

                      {/* Judul */}
                      <td style={{ padding: '10px 16px', minWidth: 200 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#0A2342' }}>{item.judul}</p>
                      </td>

                      {/* Konten ringkas */}
                      <td style={{ padding: '10px 16px', maxWidth: 400 }}>
                        <p style={{ margin: 0, fontSize: 11, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 380 }}>
                          {item.konten}
                        </p>
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button type="button" onClick={() => { setForm({ ...item }); setTimeout(() => document.getElementById('tf-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100) }}
                            style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid #DBEAFE', background: '#F0F7FF', color: '#0D47A1', fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Pencil size={10} /> Edit
                          </button>
                          <button type="button" onClick={() => handleDelete(item)}
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

      {/* ── Form ── */}
      {form !== null && (
        <div id="tf-form" style={{ background: 'white', borderRadius: 16, border: '1px solid #DBEAFE', boxShadow: '0 4px 24px rgba(13,71,161,.10)', overflow: 'hidden' }}>

          {/* Header form */}
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EEF3FC', background: 'linear-gradient(135deg,#0A2342 0%,#0D47A1 100%)' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'white' }}>
                {form.id ? '✏️ Edit Tugas & Fungsi' : '✨ Tambah Tugas & Fungsi'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
                {form.id ? `Mengedit: ${form.judul}` : 'Isi form di bawah ini'}
              </p>
            </div>
            <button type="button" onClick={() => setForm(null)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Judul + Urutan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  Judul <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  value={form.judul ?? ''}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  placeholder="Contoh: Tugas Pokok dan Fungsi PPID"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box', border: '1px solid #DBEAFE', background: '#F8FAFF', fontSize: 12, color: '#0A2342', outline: 'none' }}
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

            {/* Konten */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Konten / Uraian <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                rows={6}
                value={form.konten ?? ''}
                onChange={(e) => setForm({ ...form, konten: e.target.value })}
                placeholder="Uraikan tugas dan fungsi PPID secara lengkap..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 10, boxSizing: 'border-box', border: '1px solid #DBEAFE', background: '#F8FAFF', fontSize: 12, color: '#0A2342', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
              />
            </div>

            {/* Info */}
            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#EFF6FF', border: '1px solid #DBEAFE', fontSize: 11, color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: 8 }}>
              <GripVertical size={13} />
              Data ini akan tampil di halaman publik <strong>/ppid/tugas-fungsi</strong>
            </div>
          </div>

          {/* Footer form */}
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #EEF3FC', background: '#FAFBFF' }}>
            <button type="button" onClick={() => setForm(null)} style={{ padding: '8px 18px', borderRadius: 10, border: '1px solid #DBEAFE', background: 'white', fontSize: 12, fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>
              Batal
            </button>
            <button type="button" onClick={handleSave} disabled={pending}
              style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: pending ? '#93C5FD' : '#0D47A1', color: 'white', fontSize: 12, fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {pending && <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />}
              {form.id ? 'Simpan Perubahan' : 'Tambah Data'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}