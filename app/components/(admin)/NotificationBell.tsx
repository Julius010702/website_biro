'use client'
// app/components/(admin)/NotificationBell.tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, ScrollText, MessageSquare, Mail, Share2, CheckCheck } from 'lucide-react'

type TipeNotifikasi = 'KEBERATAN' | 'PERMOHONAN' | 'KONTAK' | 'BERITA_SHARE'

type Notifikasi = {
  id: string
  tipe: TipeNotifikasi
  judul: string
  pesan: string
  link: string | null
  dibaca: boolean
  createdAt: string
}

const TIPE_ICON: Record<TipeNotifikasi, React.ReactNode> = {
  KEBERATAN:    <ScrollText    className="w-4 h-4" />,
  PERMOHONAN:   <MessageSquare className="w-4 h-4" />,
  KONTAK:       <Mail          className="w-4 h-4" />,
  BERITA_SHARE: <Share2        className="w-4 h-4" />,
}

const TIPE_COLOR: Record<TipeNotifikasi, { color: string; bg: string }> = {
  KEBERATAN:    { color: '#DC2626', bg: '#FFF1F2' },
  PERMOHONAN:   { color: '#0D47A1', bg: '#EFF6FF' },
  KONTAK:       { color: '#7C3AED', bg: '#F5F3FF' },
  BERITA_SHARE: { color: '#065F46', bg: '#ECFDF5' },
}

function waktuRelatif(iso: string) {
  const detik = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (detik < 60) return 'Baru saja'
  const menit = Math.floor(detik / 60)
  if (menit < 60) return `${menit} menit lalu`
  const jam = Math.floor(menit / 60)
  if (jam < 24) return `${jam} jam lalu`
  const hari = Math.floor(jam / 24)
  return `${hari} hari lalu`
}

export default function NotificationBell() {
  const [open, setOpen]          = useState(false)
  const [list, setList]          = useState<Notifikasi[]>([])
  const [unreadCount, setUnread] = useState(0)
  const ref                      = useRef<HTMLDivElement>(null)
  const router                   = useRouter()

  const load = useCallback(async () => {
    try {
      const res  = await fetch('/api/admin/notifikasi')
      const data = await res.json()
      setList(data.list ?? [])
      setUnread(data.unreadCount ?? 0)
    } catch {
      // diamkan; polling berikutnya akan coba lagi
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 20000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function markAllRead() {
    setList((prev) => prev.map((n) => ({ ...n, dibaca: true })))
    setUnread(0)
    await fetch('/api/admin/notifikasi', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ markAll: true }),
    }).catch(() => {})
  }

  async function handleClickItem(n: Notifikasi) {
    setOpen(false)
    if (!n.dibaca) {
      setList((prev) => prev.map((x) => (x.id === n.id ? { ...x, dibaca: true } : x)))
      setUnread((c) => Math.max(0, c - 1))
      fetch('/api/admin/notifikasi', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: n.id }),
      }).catch(() => {})
    }
    if (n.link) router.push(n.link)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-blue-50"
        style={{ border: '1px solid #DBEAFE', color: '#64748B' }}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: '#DC2626' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'white', border: '1px solid #DBEAFE', width: 340 }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}
          >
            <p className="text-xs font-bold" style={{ color: '#0A2342' }}>Notifikasi</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 hover:text-blue-900"
              >
                <CheckCheck className="w-3 h-3" /> Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {list.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-6 h-6 mx-auto mb-2 text-slate-200" />
                <p className="text-xs text-slate-400">Belum ada notifikasi.</p>
              </div>
            ) : (
              list.map((n) => {
                const c = TIPE_COLOR[n.tipe]
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClickItem(n)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                    style={{ borderBottom: '1px solid #F1F5F9', background: n.dibaca ? 'white' : '#F8FAFF' }}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: c.bg, color: c.color }}
                    >
                      {TIPE_ICON[n.tipe]}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1.5">
                        {!n.dibaca && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#0D47A1' }} />}
                        <span className="text-xs font-bold truncate" style={{ color: '#0A2342' }}>{n.judul}</span>
                      </span>
                      <span className="block text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">{n.pesan}</span>
                      <span className="block text-[10px] text-slate-300 mt-1">{waktuRelatif(n.createdAt)}</span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
