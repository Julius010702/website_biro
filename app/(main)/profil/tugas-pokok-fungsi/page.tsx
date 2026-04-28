// app/(main)/profil/tupoksi/page.tsx
import { prisma }   from '@/lib/prisma'
import Link         from 'next/link'
import { ClipboardList, ChevronRight, User, FileText, Users, Building2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tugas Pokok dan Fungsi — Biro Organisasi NTT' }

const profilMenu = [
  { label: 'Tentang Kami',         href: '/profil/sekapur-sirih',       icon: <User          className="w-4 h-4" /> },
  { label: 'Struktur Organisasi',  href: '/profil/struktur-organisasi', icon: <Users         className="w-4 h-4" /> },
  { label: 'Tugas Pokok & Fungsi', href: '/profil/tugas-pokok-fungsi',             icon: <FileText      className="w-4 h-4" /> },
  { label: 'Bagian',               href: '/profil/bagian',              icon: <Building2     className="w-4 h-4" /> },
]

const accentColors = [
  { from: '#0D47A1', to: '#1565C0', badge: '#0D47A1' },
  { from: '#065F46', to: '#047857', badge: '#065F46' },
  { from: '#7C3AED', to: '#6D28D9', badge: '#7C3AED' },
  { from: '#B45309', to: '#D97706', badge: '#B45309' },
  { from: '#BE185D', to: '#DB2777', badge: '#BE185D' },
  { from: '#0E7490', to: '#0891B2', badge: '#0E7490' },
]

export default async function TupoksiPage() {
  const items = await prisma.tugasPokokFungsi.findMany({
    orderBy: { urutan: 'asc' },
  })

  return (
    <main style={{ background: '#F4F7FD', minHeight: '100vh' }}>

      {/* ── Hero Header ── */}
      <section className="relative py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2342 0%, #0D47A1 55%, #1565C0 100%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
          <defs><pattern id="tupoksi-dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#tupoksi-dot)" />
        </svg>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 65%)' }} />

        <div className="relative max-w-screen-2xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/50 mb-6 reveal reveal-up">
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white/80 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/profil/sekapur-sirih" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white/80 transition-colors">Profil</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 font-medium">Tugas Pokok & Fungsi</span>
          </div>

          <div className="flex items-start gap-4 reveal reveal-up reveal-delay-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)' }}>
              <ClipboardList className="w-6 h-6" style={{ color: '#F5A623' }} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 mb-1">Profil</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Tugas Pokok dan Fungsi
              </h1>
              <p className="text-sm text-white/55 mt-1.5 max-w-xl">
                Tugas pokok dan fungsi Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur berdasarkan peraturan perundang-undangan yang berlaku.
              </p>
              <div className="flex items-center gap-1.5 mt-3">
                <div className="w-8 h-0.5 rounded-full bg-white/60" />
                <div className="w-3 h-0.5 rounded-full bg-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">

          {/* ── Main Content ── */}
          <div className="flex flex-col gap-5">

            {/* Counter total */}
            {items.length > 0 && (
              <div className="flex items-center gap-3 reveal reveal-up">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: 'white', border: '1px solid #DBEAFE' }}>
                  <ClipboardList className="w-4 h-4" style={{ color: '#0D47A1' }} />
                  <span className="text-xs font-semibold" style={{ color: '#0A2342' }}>
                    {items.length} Tugas & Fungsi
                  </span>
                </div>
              </div>
            )}

            {items.length > 0 ? (
              items.map((item, i) => {
                const accent = accentColors[i % accentColors.length]
                const delayClass = i < 4 ? `reveal-delay-${i + 1}` : ''
                return (
                  <div key={item.id}
                    className={`rounded-2xl overflow-hidden reveal reveal-up ${delayClass}`}
                    style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 2px 12px rgba(13,71,161,0.06)' }}>

                    {/* Card header */}
                    <div className="flex items-center gap-4 px-5 py-4"
                      style={{ borderBottom: '1px solid #EFF6FF', background: 'linear-gradient(90deg, #F8FAFF, white)' }}>

                      {/* Number badge */}
                      <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                        style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`, color: 'white', boxShadow: `0 3px 10px ${accent.from}35` }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>

                      <h3 className="text-sm font-bold leading-snug flex-1" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
                        {item.judul}
                      </h3>

                      {/* Accent bar kanan */}
                      <div className="w-1 h-8 rounded-full shrink-0" style={{ background: `linear-gradient(to bottom, ${accent.from}, ${accent.to})` }} />
                    </div>

                    {/* Content */}
                    <div className="px-5 py-5">
                      <div
                        className="prose prose-sm max-w-none prose-li:marker:text-blue-600 prose-headings:text-blue-900"
                        style={{ color: '#4B5563', lineHeight: '1.85' }}
                        dangerouslySetInnerHTML={{ __html: item.konten }}
                      />
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-0.5 w-full"
                      style={{ background: `linear-gradient(90deg, ${accent.from}40, ${accent.to}20, transparent)` }} />
                  </div>
                )
              })
            ) : (
              <div className="rounded-2xl p-12 text-center reveal reveal-up"
                style={{ background: 'white', border: '1px solid #DBEAFE' }}>
                <ClipboardList className="w-12 h-12 mx-auto mb-3" style={{ color: '#BFDBFE' }} />
                <p className="text-sm font-semibold" style={{ color: '#94A3B8' }}>Data tugas pokok dan fungsi belum tersedia.</p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:sticky lg:top-24 flex flex-col gap-4">

            {/* Menu Profil */}
            <div className="rounded-2xl overflow-hidden reveal reveal-right"
              style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 2px 16px rgba(13,71,161,0.07)' }}>
              <div className="px-5 py-4 flex items-center gap-3"
                style={{ background: 'linear-gradient(135deg, #0A2342, #0D47A1)' }}>
                <Building2 className="w-5 h-5 text-yellow-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">Menu</p>
                  <p className="text-sm font-bold text-white leading-tight">Profil Biro</p>
                </div>
              </div>
              <nav className="p-2">
                {profilMenu.map((item) => {
                  const isActive = item.href === '/profil/tupoksi'
                  return (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background:     isActive ? '#EFF6FF'   : 'transparent',
                        color:          isActive ? '#0D47A1'   : '#475569',
                        borderLeft:     isActive ? '3px solid #0D47A1' : '3px solid transparent',
                        textDecoration: 'none',
                      }}>
                      <span style={{ color: isActive ? '#0D47A1' : '#94A3B8' }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Info dasar hukum */}
            <div className="rounded-2xl p-4 reveal reveal-right reveal-delay-1"
              style={{ background: 'white', border: '1px solid #DBEAFE' }}>
              <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: '#94A3B8' }}>Dasar Hukum</p>
              <div className="space-y-2">
                {[
                  'Peraturan Gubernur NTT tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi',
                  'PP No. 18 Tahun 2016 tentang Perangkat Daerah',
                ].map((hukum, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#0D47A1' }} />
                    <p className="text-[11px] leading-snug" style={{ color: '#475569' }}>{hukum}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info card */}
            <div className="rounded-2xl p-4 reveal reveal-right reveal-delay-2"
              style={{ background: 'linear-gradient(135deg, #0A2342, #0D47A1)', border: '1px solid #0D47A1' }}>
              <p className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-2">Biro Organisasi</p>
              <p className="text-sm font-bold text-white leading-snug mb-3">Setda Provinsi Nusa Tenggara Timur</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Lantai 3 Kantor Gubernur NTT', icon: '📍' },
                  { label: 'Senin–Jumat: 08.00–16.00 WITA', icon: '🕐' },
                  { label: '(0380) 831021', icon: '📞' },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">{info.icon}</span>
                    <p className="text-[11px] text-white/60 leading-snug">{info.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  )
}