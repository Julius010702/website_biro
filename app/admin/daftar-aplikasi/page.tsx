'use client'
import { useEffect, useState, useTransition } from 'react'
import { Plus, Trash2, Save, CheckCircle2, AlertCircle, Pencil, ExternalLink, Monitor } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing-client'
import NextImg from 'next/image'

type Aplikasi = { id: string; nama: string; deskripsi: string | null; href: string; kategori: string | null; logo: string | null; urutan: number; aktif: boolean }

function Toast({ msg, type }: { msg: string; type: 'ok' | 'err' }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl"
      style={{ background: type === 'ok' ? '#ECFDF5' : '#FFF1F2', color: type === 'ok' ? '#065F46' : '#9D174D', border: '1px solid ' + (type === 'ok' ? '#D1FAE5' : '#FCE7F3') }}>
      {type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}{msg}
    </div>
  )
}

function LogoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false)
  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) onChange(res[0].ufsUrl)
      setBusy(false)
    },
    onUploadError: () => { setBusy(false) },
  })
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        {value && (
          <NextImg src={value} alt="logo" width={40} height={40} className="rounded-lg object-contain" style={{ border: '1px solid #E2EAF6' }} />
        )}
        <label className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105"
          style={{ background: busy ? '#F1F5F9' : '#EFF6FF', color: busy ? '#94A3B8' : '#0D47A1', border: '1px solid #DBEAFE', pointerEvents: busy ? 'none' : 'auto' }}>
          {busy ? '⏳ Mengupload...' : '📁 Upload Logo'}
          <input type="file" accept="image/*" className="hidden"
            onChange={async function(e) {
              const f = e.target.files?.[0]
              if (!f) return
              setBusy(true)
              await startUpload([f])
              e.target.value = ''
            }} disabled={busy} />
        </label>
        {value && (
          <button type="button" onClick={function() { onChange('') }}
            className="text-xs text-red-400 hover:text-red-600">Hapus</button>
        )}
      </div>
      <input value={value} onChange={function(e) { onChange(e.target.value) }}
        placeholder="atau paste URL logo..."
        className="rounded-xl px-3 py-2 text-xs outline-none"
        style={{ border: '1px solid #E2EAF6', background: '#F8FAFF', color: '#0A2342' }} />
    </div>
  )
}

export default function DaftarAplikasiAdminPage() {
  const [list, setList] = useState<Aplikasi[]>([])
  const [form, setForm] = useState<Partial<Aplikasi> | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [, start] = useTransition()

  function showToast(msg: string, type: 'ok' | 'err') {
    setToast({ msg, type })
    setTimeout(function() { setToast(null) }, 3000)
  }

  function load() {
    fetch('/api/admin/daftar-aplikasi').then(function(r) { return r.json() }).then(function(d) { setList(d) })
  }
  useEffect(function() { load() }, [])

  function handleSave() {
    if (!form?.nama || !form?.href) return showToast('Nama dan URL wajib diisi', 'err')
    start(async function() {
      try {
        const method = form.id ? 'PUT' : 'POST'
        const url = form.id ? '/api/admin/daftar-aplikasi/' + form.id : '/api/admin/daftar-aplikasi'
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nama: form.nama, deskripsi: form.deskripsi ?? null, href: form.href, kategori: form.kategori ?? null, logo: form.logo ?? null, urutan: form.urutan ?? 0, aktif: form.aktif ?? true }) })
        showToast(form.id ? 'Berhasil diperbarui!' : 'Berhasil ditambahkan!', 'ok')
        setForm(null); load()
      } catch { showToast('Terjadi kesalahan', 'err') }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Hapus aplikasi ini?')) return
    start(async function() {
      await fetch('/api/admin/daftar-aplikasi/' + id, { method: 'DELETE' })
      showToast('Aplikasi dihapus', 'ok'); load()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #E2EAF6' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-blue-700" />
            <h1 className="text-xl font-bold" style={{ color: '#0A2342' }}>Daftar Aplikasi</h1>
          </div>
          <button onClick={function() { setForm({ aktif: true, urutan: list.length }) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: '#0D47A1', color: 'white' }}>
            <Plus className="w-3.5 h-3.5" /> Tambah Aplikasi
          </button>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2EAF6' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFF', borderBottom: '1px solid #E2EAF6' }}>
              {['No', 'Logo', 'Nama', 'URL', 'Kategori', 'Status', 'Aksi'].map(function(h) {
                return <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Belum ada aplikasi.</td></tr>
            ) : list.map(function(a, i) {
              return (
                <tr key={a.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B' }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                      {a.logo
                        ? <NextImg src={a.logo} alt={a.nama} width={32} height={32} className="object-contain rounded" />
                        : <Monitor className="w-5 h-5" style={{ color: '#0D47A1' }} />}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0A2342' }}>{a.nama}</p>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <a href={a.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1" style={{ fontSize: 11, color: '#1565C0' }}>
                      <ExternalLink className="w-3 h-3" />{a.href.replace('https://', '').replace('http://', '').slice(0, 30)}
                    </a>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#EFF6FF', color: '#0D47A1' }}>{a.kategori ?? '-'}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: a.aktif ? '#ECFDF5' : '#F1F5F9', color: a.aktif ? '#065F46' : '#94A3B8' }}>{a.aktif ? 'Aktif' : 'Nonaktif'}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div className="flex gap-2">
                      <button onClick={function() { setForm({ ...a }) }}
                        style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid #DBEAFE', background: '#F0F7FF', color: '#0D47A1', fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={function() { handleDelete(a.id) }}
                        style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid #FECACA', background: '#FFF5F5', color: '#DC2626', fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {form !== null && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2EAF6' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}>
            <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>{form.id ? 'Edit Aplikasi' : 'Tambah Aplikasi'}</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Nama Aplikasi *', field: 'nama', placeholder: 'G-SINJAB' },
              { label: 'URL Aplikasi *', field: 'href', placeholder: 'https://...' },
              { label: 'Kategori', field: 'kategori', placeholder: 'Manajemen ASN' },
              { label: 'Urutan', field: 'urutan', placeholder: '0' },
            ].map(function(f) {
              return (
                <div key={f.field} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>{f.label}</label>
                  <input
                    value={String((form as Record<string, unknown>)[f.field] ?? '')}
                    onChange={function(e) { setForm(function(prev) { return { ...prev, [f.field]: f.field === 'urutan' ? parseInt(e.target.value) || 0 : e.target.value } }) }}
                    placeholder={f.placeholder}
                    className="rounded-xl px-3 py-2.5 text-sm outline-none"
                    style={{ border: '1px solid #E2EAF6', background: '#F8FAFF', color: '#0A2342' }}
                  />
                </div>
              )
            })}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Logo Aplikasi</label>
              <LogoUpload value={form.logo ?? ''} onChange={function(url) { setForm(function(prev) { return { ...prev, logo: url } }) }} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Deskripsi</label>
              <textarea rows={3} value={form.deskripsi ?? ''}
                onChange={function(e) { setForm(function(prev) { return { ...prev, deskripsi: e.target.value } }) }}
                placeholder="Deskripsi singkat aplikasi..."
                className="rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ border: '1px solid #E2EAF6', background: '#F8FAFF', color: '#0A2342', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.aktif ?? true}
                onChange={function(e) { setForm(function(prev) { return { ...prev, aktif: e.target.checked } }) }} />
              <span className="text-xs font-semibold" style={{ color: '#374151' }}>Aktif (tampil di website)</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 px-6 py-4" style={{ borderTop: '1px solid #EEF3FC' }}>
            <button onClick={function() { setForm(null) }}
              className="px-4 py-2 rounded-xl text-xs font-bold"
              style={{ background: '#F1F5F9', color: '#64748B' }}>Batal</button>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
              style={{ background: '#0D47A1', color: 'white' }}>
              <Save className="w-3.5 h-3.5" /> Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
