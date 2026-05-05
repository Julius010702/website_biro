'use client'
import { useEffect, useState, useTransition } from 'react'
import { Phone, Instagram, Globe, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

type InformasiKontak = { id: string; nama: string; nilai: string; ikon: string | null; tipe: string; urutan: number }
type SitusTerkait = { id: string; label: string; href: string; aktif: boolean; urutan: number }
type SosialMedia = { key: string; platform: string; url: string; aktif: boolean }

function Toast({ msg, type }: { msg: string; type: 'ok' | 'err' }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl"
      style={{ background: type === 'ok' ? '#ECFDF5' : '#FFF1F2', color: type === 'ok' ? '#065F46' : '#9D174D', border: '1px solid ' + (type === 'ok' ? '#D1FAE5' : '#FCE7F3') }}>
      {type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {msg}
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2EAF6' }}>
      <div className="flex items-center gap-2 px-6 py-4" style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}>
        <span style={{ color: '#0D47A1' }}>{icon}</span>
        <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function SaveBtn({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
      style={{ background: '#0D47A1', color: 'white' }}>
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
      Simpan
    </button>
  )
}

const ikonOptions = [
  { value: 'MapPin', label: 'Alamat (Pin)' },
  { value: 'Phone', label: 'Telepon' },
  { value: 'Mail', label: 'Email' },
  { value: 'Clock', label: 'Jam Kerja' },
  { value: 'Globe', label: 'Website' },
]

export default function FooterAdminPage() {
  const [kontak, setKontak] = useState<InformasiKontak[]>([])
  const [situs, setSitus] = useState<SitusTerkait[]>([])
  const [sosmed, setSosmed] = useState<SosialMedia[]>([])
  const [loadingKontak, setLoadingKontak] = useState(false)
  const [loadingSitus, setLoadingSitus] = useState(false)
  const [loadingSosmed, setLoadingSosmed] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [, start] = useTransition()

  function showToast(msg: string, type: 'ok' | 'err') {
    setToast({ msg, type })
    setTimeout(function() { setToast(null) }, 3000)
  }

  useEffect(function() {
    fetch('/api/admin/informasi-kontak').then(function(r) { return r.json() }).then(function(d) { setKontak(d) })
    fetch('/api/admin/situs-terkait').then(function(r) { return r.json() }).then(function(d) { setSitus(d) })
    fetch('/api/admin/site-settings?prefix=sosmed_').then(function(r) { return r.json() }).then(function(d: Array<{ key: string; value: string }>) {
      setSosmed(d.map(function(s) {
        try { const v = JSON.parse(s.value); return { key: s.key, platform: v.platform, url: v.url, aktif: v.aktif } }
        catch { return { key: s.key, platform: '', url: s.value, aktif: true } }
      }))
    })
  }, [])

  function updateKontak(id: string, field: keyof InformasiKontak, val: string | number) {
    setKontak(function(prev) { return prev.map(function(k) { return k.id === id ? { ...k, [field]: val } : k }) })
  }
  function addKontak() {
    start(async function() {
      const res = await fetch('/api/admin/informasi-kontak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nama: 'Label Baru', nilai: '', ikon: 'Globe', tipe: 'teks', urutan: kontak.length }) })
      if (res.ok) { const d = await res.json() as InformasiKontak; setKontak(function(prev) { return [...prev, d] }) }
    })
  }
  function removeKontak(id: string) {
    start(async function() {
      const res = await fetch('/api/admin/informasi-kontak/' + id, { method: 'DELETE' })
      if (res.ok) setKontak(function(prev) { return prev.filter(function(k) { return k.id !== id }) })
      else showToast('Gagal menghapus.', 'err')
    })
  }
  function saveKontak() {
    setLoadingKontak(true)
    start(async function() {
      try {
        await Promise.all(kontak.map(function(k) {
          return fetch('/api/admin/informasi-kontak/' + k.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nama: k.nama, nilai: k.nilai, ikon: k.ikon, tipe: k.tipe, urutan: k.urutan }) })
        }))
        showToast('Kontak berhasil disimpan!', 'ok')
      } catch { showToast('Gagal menyimpan kontak.', 'err') }
      finally { setLoadingKontak(false) }
    })
  }

  function updateSitus(id: string, field: keyof SitusTerkait, val: string | boolean | number) {
    setSitus(function(prev) { return prev.map(function(s) { return s.id === id ? { ...s, [field]: val } : s }) })
  }
  function addSitus() {
    start(async function() {
      const res = await fetch('/api/admin/situs-terkait', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label: 'Situs Baru', href: 'https://', aktif: true, urutan: situs.length }) })
      if (res.ok) { const d = await res.json() as SitusTerkait; setSitus(function(prev) { return [...prev, d] }) }
    })
  }
  function removeSitus(id: string) {
    start(async function() {
      const res = await fetch('/api/admin/situs-terkait/' + id, { method: 'DELETE' })
      if (res.ok) setSitus(function(prev) { return prev.filter(function(s) { return s.id !== id }) })
      else showToast('Gagal menghapus.', 'err')
    })
  }
  function saveSitus() {
    setLoadingSitus(true)
    start(async function() {
      try {
        await Promise.all(situs.map(function(s) {
          return fetch('/api/admin/situs-terkait/' + s.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label: s.label, href: s.href, aktif: s.aktif, urutan: s.urutan }) })
        }))
        showToast('Situs terkait berhasil disimpan!', 'ok')
      } catch { showToast('Gagal menyimpan situs terkait.', 'err') }
      finally { setLoadingSitus(false) }
    })
  }

  function updateSosmed(key: string, field: keyof SosialMedia, val: string | boolean) {
    setSosmed(function(prev) { return prev.map(function(s) { return s.key === key ? { ...s, [field]: val } : s }) })
  }
  function addSosmed() {
    setSosmed(function(prev) { return [...prev, { key: 'sosmed_' + Date.now(), platform: '', url: 'https://', aktif: true }] })
  }
  function removeSosmed(key: string) {
    start(async function() {
      await fetch('/api/admin/site-settings/' + encodeURIComponent(key), { method: 'DELETE' })
      setSosmed(function(prev) { return prev.filter(function(s) { return s.key !== key }) })
    })
  }
  function saveSosmed() {
    setLoadingSosmed(true)
    start(async function() {
      try {
        await Promise.all(sosmed.map(function(s) {
          return fetch('/api/admin/site-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: s.key, value: JSON.stringify({ platform: s.platform, url: s.url, aktif: s.aktif }), label: s.platform }) })
        }))
        showToast('Sosial media berhasil disimpan!', 'ok')
      } catch { showToast('Gagal menyimpan sosial media.', 'err') }
      finally { setLoadingSosmed(false) }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <SectionCard title="Informasi Kontak" icon={<Phone className="w-4 h-4" />}>
        <div className="flex flex-col gap-3 mb-4">
          {kontak.sort(function(a, b) { return a.urutan - b.urutan }).map(function(k) {
            return (
              <div key={k.id} className="p-4 rounded-xl" style={{ background: '#F8FAFF', border: '1px solid #E2EAF6' }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Label</label>
                    <input value={k.nama} onChange={function(e) { updateKontak(k.id, 'nama', e.target.value) }}
                      className="rounded-lg px-3 py-2 text-xs outline-none" style={{ border: '1px solid #E2EAF6', background: 'white', color: '#0A2342' }} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Ikon</label>
                    <select value={k.ikon ?? ''} onChange={function(e) { updateKontak(k.id, 'ikon', e.target.value) }}
                      className="rounded-lg px-3 py-2 text-xs outline-none" style={{ border: '1px solid #E2EAF6', background: 'white', color: '#0A2342' }}>
                      {ikonOptions.map(function(opt) { return <option key={opt.value} value={opt.value}>{opt.label}</option> })}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Urutan</label>
                    <input type="number" value={k.urutan} onChange={function(e) { updateKontak(k.id, 'urutan', parseInt(e.target.value)) }}
                      className="rounded-lg px-3 py-2 text-xs outline-none" style={{ border: '1px solid #E2EAF6', background: 'white', color: '#0A2342' }} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Nilai / Isi</label>
                    <input value={k.nilai} onChange={function(e) { updateKontak(k.id, 'nilai', e.target.value) }}
                      placeholder="mis: Jl. Basuki Rahmat No.1..." className="rounded-lg px-3 py-2 text-xs outline-none"
                      style={{ border: '1px solid #E2EAF6', background: 'white', color: '#0A2342' }} />
                  </div>
                  <button onClick={function() { removeKontak(k.id) }}
                    className="mt-5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 hover:bg-red-100" style={{ color: '#EF4444' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
          {kontak.length === 0 && <p className="text-xs text-center py-4" style={{ color: '#94A3B8' }}>Belum ada data kontak.</p>}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={addKontak} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg hover:scale-105 transition-all"
            style={{ background: '#EFF6FF', color: '#0D47A1', border: '1px solid #DBEAFE' }}>
            <Plus className="w-3.5 h-3.5" /> Tambah Kontak
          </button>
          <SaveBtn loading={loadingKontak} onClick={saveKontak} />
        </div>
      </SectionCard>

      <SectionCard title="Sosial Media" icon={<Instagram className="w-4 h-4" />}>
        <div className="flex flex-col gap-3 mb-4">
          {sosmed.map(function(s) {
            return (
              <div key={s.key} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFF', border: '1px solid #E2EAF6' }}>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input value={s.platform} onChange={function(e) { updateSosmed(s.key, 'platform', e.target.value) }}
                    placeholder="Instagram / YouTube / Facebook ..." className="rounded-lg px-3 py-2 text-xs outline-none"
                    style={{ border: '1px solid #E2EAF6', background: 'white', color: '#0A2342' }} />
                  <input value={s.url} onChange={function(e) { updateSosmed(s.key, 'url', e.target.value) }}
                    placeholder="https://..." className="rounded-lg px-3 py-2 text-xs outline-none"
                    style={{ border: '1px solid #E2EAF6', background: 'white', color: '#0A2342' }} />
                </div>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0" style={{ color: '#64748B' }}>
                  <input type="checkbox" checked={s.aktif} onChange={function(e) { updateSosmed(s.key, 'aktif', e.target.checked) }} /> Aktif
                </label>
                <button onClick={function() { removeSosmed(s.key) }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-100" style={{ color: '#EF4444' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
          {sosmed.length === 0 && <p className="text-xs text-center py-4" style={{ color: '#94A3B8' }}>Belum ada sosial media.</p>}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={addSosmed} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg hover:scale-105 transition-all"
            style={{ background: '#EFF6FF', color: '#0D47A1', border: '1px solid #DBEAFE' }}>
            <Plus className="w-3.5 h-3.5" /> Tambah Platform
          </button>
          <SaveBtn loading={loadingSosmed} onClick={saveSosmed} />
        </div>
      </SectionCard>

      <SectionCard title="Situs Terkait" icon={<Globe className="w-4 h-4" />}>
        <div className="flex flex-col gap-3 mb-4">
          {situs.sort(function(a, b) { return a.urutan - b.urutan }).map(function(s) {
            return (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFF', border: '1px solid #E2EAF6' }}>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input value={s.label} onChange={function(e) { updateSitus(s.id, 'label', e.target.value) }}
                    placeholder="Nama Situs" className="rounded-lg px-3 py-2 text-xs outline-none"
                    style={{ border: '1px solid #E2EAF6', background: 'white', color: '#0A2342' }} />
                  <input value={s.href} onChange={function(e) { updateSitus(s.id, 'href', e.target.value) }}
                    placeholder="https://..." className="rounded-lg px-3 py-2 text-xs outline-none"
                    style={{ border: '1px solid #E2EAF6', background: 'white', color: '#0A2342' }} />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input type="number" value={s.urutan} onChange={function(e) { updateSitus(s.id, 'urutan', parseInt(e.target.value)) }}
                    className="w-14 rounded-lg px-2 py-2 text-xs text-center outline-none" title="Urutan"
                    style={{ border: '1px solid #E2EAF6', background: 'white', color: '#0A2342' }} />
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer" style={{ color: '#64748B' }}>
                    <input type="checkbox" checked={s.aktif} onChange={function(e) { updateSitus(s.id, 'aktif', e.target.checked) }} /> Aktif
                  </label>
                  <button onClick={function() { removeSitus(s.id) }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-100" style={{ color: '#EF4444' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
          {situs.length === 0 && <p className="text-xs text-center py-4" style={{ color: '#94A3B8' }}>Belum ada situs terkait.</p>}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={addSitus} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg hover:scale-105 transition-all"
            style={{ background: '#EFF6FF', color: '#0D47A1', border: '1px solid #DBEAFE' }}>
            <Plus className="w-3.5 h-3.5" /> Tambah Situs
          </button>
          <SaveBtn loading={loadingSitus} onClick={saveSitus} />
        </div>
      </SectionCard>
    </div>
  )
}
