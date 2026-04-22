// components/shared/ProfilSidebar.tsx
import Link from 'next/link'
import {
  User, Building2, ClipboardList, Layers,
  ChevronRight, ExternalLink
} from 'lucide-react'

const profilMenu = [
  { label: 'Tentang Kami',         href: '/profil/sekapur-sirih',      icon: <User className="w-4 h-4" /> },
  { label: 'Struktur Organisasi',   href: '/profil/struktur-organisasi', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Tugas Pokok & Fungsi',  href: '/profil/tugas-pokok-fungsi',  icon: <ClipboardList className="w-4 h-4" /> },
]

const bagianMenu = [
  { label: 'Kelembagaan & Analisis Jabatan',      href: '/profil/bagian/kelembagaan-analisis-jabatan' },
  { label: 'Reformasi Birokrasi & Akuntabilitas', href: '/profil/bagian/reformasi-birokrasi-akuntabilitas' },
  { label: 'Tata Laksana',                        href: '/profil/bagian/tata-laksana' },
]

interface ProfilSidebarProps {
  activeHref: string
  title?: string
  description?: string
}

export default function ProfilSidebar({ activeHref, title, description }: ProfilSidebarProps) {
  return (
    <aside className="flex flex-col gap-4">

      {/* Info card */}
      {(title || description) && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
            boxShadow: '0 4px 20px rgba(13,71,161,0.25)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <Layers className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-bold text-white leading-snug">{title}</p>
          </div>
          {description && (
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Navigation menu */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid #DBEAFE', background: 'white', boxShadow: '0 2px 12px rgba(13,71,161,0.06)' }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: '1px solid #EFF6FF', background: '#F8FAFF' }}
        >
          <p className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: '#1565C0' }}>
            Menu Profil
          </p>
        </div>
        <nav className="flex flex-col">
          {profilMenu.map((item) => {
            const active = activeHref === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all hover:bg-blue-50 group"
                style={{
                  color: active ? '#0D47A1' : '#374151',
                  background: active ? '#EFF6FF' : undefined,
                  borderLeft: active ? '3px solid #0D47A1' : '3px solid transparent',
                  borderBottom: '1px solid #F0F4FF',
                }}
              >
                <span style={{ color: active ? '#0D47A1' : '#9CA3AF' }} className="group-hover:text-blue-600 transition-colors">
                  {item.icon}
                </span>
                {item.label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: '#0D47A1' }} />}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bagian sub-menu */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid #DBEAFE', background: 'white', boxShadow: '0 2px 12px rgba(13,71,161,0.06)' }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: '1px solid #EFF6FF', background: '#F8FAFF' }}
        >
          <p className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: '#1565C0' }}>
            Bagian
          </p>
        </div>
        <nav className="flex flex-col">
          {bagianMenu.map((item) => {
            const active = activeHref === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all hover:bg-blue-50 group"
                style={{
                  color: active ? '#0D47A1' : '#4B5563',
                  background: active ? '#EFF6FF' : undefined,
                  borderLeft: active ? '3px solid #F5A623' : '3px solid transparent',
                  borderBottom: '1px solid #F0F4FF',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                  style={{ background: active ? '#F5A623' : '#CBD5E1' }}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Quick links */}
      <div
        className="rounded-2xl p-4"
        style={{ background: '#F8FAFF', border: '1px solid #DBEAFE' }}
      >
        <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#94A3B8' }}>
          Tautan Cepat
        </p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'SINJAB NTT',  href: 'http://nusatenggaratimurprov3.5.sinjab.info/' },
            { label: 'SiMBAGA NTT', href: 'https://simbagabiroorganisasi.nttprov.go.id/login' },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold transition-colors hover:text-blue-700"
              style={{ color: '#1565C0' }}
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              {l.label}
            </a>
          ))}
        </div>
      </div>

    </aside>
  )
}