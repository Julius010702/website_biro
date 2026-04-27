'use client'
// components/admin/AdminHeader.tsx
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Bell, ExternalLink } from 'lucide-react'
import type { SessionUser } from '@/lib/auth'

interface AdminHeaderProps {
  user: SessionUser
}

const PPID_PERMOHONAN_URL = 'http://ppidutama.nttprov.go.id'

const pathTitles: Record<string, string> = {
  '/admin':                                   'Dashboard',
  '/admin/profil/sekapur-sirih':              'Tentang Kami',
  '/admin/profil/struktur-organisasi':        'Struktur Organisasi',
  '/admin/profil/tupoksi':                    'Tugas Pokok & Fungsi',
  '/admin/profil/bagian':                     'Bagian',
  '/admin/beranda/slider':                    'Slider Beranda',
  '/admin/beranda/statistik':                 'Statistik Beranda',
  '/admin/berita':                            'Berita',
  '/admin/kegiatan':                          'Kegiatan',
  '/admin/galeri':                            'Galeri',
  // ── PPID ──────────────────────────────────────────────────────────────────
  '/admin/ppid/seputar':                      'Seputar PPID',
  '/admin/ppid/tugas-fungsi':                 'Tugas & Fungsi PPID',
  '/admin/ppid/struktur-organisasi':          'Struktur Organisasi PPID',
  '/admin/ppid/maklumat':                     'Maklumat Pelayanan',
  '/admin/ppid/pelayanan':                    'Pelayanan Informasi',
  '/admin/ppid/informasi-publik':             'Informasi Publik',
  '/admin/ppid/permohonan':                   'Permohonan Informasi',
  
  // ── Lainnya ───────────────────────────────────────────────────────────────
  '/admin/kontak':                            'Pesan Kontak',
  '/admin/pengaduan':                         'Pengaduan (WBS)',
  '/admin/pengaturan':                        'Pengaturan Situs',
}

/** Routes that should open an external URL instead of rendering a local page */
const externalRoutes: Record<string, string> = {
  '/admin/ppid/permohonan': PPID_PERMOHONAN_URL,
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname()
  const router   = useRouter()

  const matchedEntry = Object.entries(pathTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))

  const title       = matchedEntry?.[1] ?? 'Admin'
  const matchedPath = matchedEntry?.[0] ?? ''
  const externalUrl = externalRoutes[matchedPath]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-3 shrink-0"
      style={{
        background: 'white',
        borderBottom: '1px solid #E2EAF6',
        boxShadow: '0 1px 4px rgba(13,71,161,0.06)',
      }}
    >
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94A3B8' }}>
          Panel Admin
        </p>
        <div className="flex items-center gap-2">
          <h1
            className="text-base font-bold"
            style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h1>

          {/* External link badge — shown only on pages mapped to an external URL */}
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#1D4ED8',
                textDecoration: 'none',
              }}
              title={`Buka ${externalUrl}`}
            >
              <ExternalLink className="w-3 h-3" />
              Buka Website
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User chip */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: '#F8FAFF', border: '1px solid #DBEAFE' }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
            style={{ background: 'linear-gradient(135deg,#0D47A1,#1565C0)', color: 'white' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-none truncate" style={{ color: '#0A2342' }}>
              {user.name}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>
              {user.role}
            </p>
          </div>
        </div>

        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-blue-50"
          style={{ border: '1px solid #DBEAFE', color: '#64748B' }}
        >
          <Bell className="w-4 h-4" />
        </button>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
        >
          <LogOut className="w-3.5 h-3.5" /> Keluar
        </button>
      </div>
    </header>
  )
}