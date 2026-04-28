// app/(main)/profil/struktur-organisasi/page.tsx
import { prisma }   from '@/lib/prisma'
import Image        from 'next/image'
import Link         from 'next/link'
import { Building2, ZoomIn, ChevronRight, User, FileText, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Struktur Organisasi — Biro Organisasi NTT' }

const profilMenu = [
  { label: 'Tentang Kami',          href: '/profil/sekapur-sirih',       icon: <User       className="w-4 h-4" /> },
  { label: 'Struktur Organisasi',   href: '/profil/struktur-organisasi', icon: <Users      className="w-4 h-4" /> },
  { label: 'Tugas Pokok & Fungsi',  href: '/profil/tupoksi',             icon: <FileText   className="w-4 h-4" /> },
  { label: 'Bagian',                href: '/profil/bagian',              icon: <Building2  className="w-4 h-4" /> },
]

export default async function StrukturOrganisasiPage() {
  const data = await prisma.strukturOrganisasi.findFirst({
    where:   { aktif: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main style={{ background: '#F4F7FD', minHeight: '100vh' }}>

      {/* ── Hero Header ── */}
      <section className="relative py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2342 0%, #0D47A1 55%, #1565C0 100%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
          <defs><pattern id="struktur-dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#struktur-dot)" />
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
            <span className="text-white/90 font-medium">Struktur Organisasi</span>
          </div>

          <div className="flex items-start gap-4 reveal reveal-up reveal-delay-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)' }}>
              <Building2 className="w-6 h-6" style={{ color: '#F5A623' }} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 mb-1">Profil</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Struktur Organisasi
              </h1>
              <p className="text-sm text-white/55 mt-1.5 max-w-xl">
                Susunan organisasi Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur beserta unit-unit kerjanya.
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
          <div className="flex flex-col gap-6">

            {data ? (
              <>
                {/* Bagan Struktur */}
                <div className="rounded-2xl overflow-hidden reveal reveal-up"
                  style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 4px 24px rgba(13,71,161,0.09)' }}>

                  {/* Card Header */}
                  <div className="flex items-center justify-between px-6 py-4"
                    style={{ background: 'linear-gradient(90deg, #EFF6FF, #F8FAFF)', borderBottom: '1px solid #DBEAFE' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
                      <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>Bagan Struktur Organisasi</h3>
                    </div>
                    <a href={data.gambar} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95"
                      style={{ background: '#EFF6FF', color: '#1565C0', border: '1px solid #BFDBFE' }}>
                      <ZoomIn className="w-3.5 h-3.5" /> Perbesar
                    </a>
                  </div>

                  {/* Image area */}
                  <div className="p-4 sm:p-8" style={{ background: '#FAFCFF' }}>
                    {/* Hint */}
                    <p className="text-[10px] text-center text-slate-400 mb-4">
                      Klik &ldquo;Perbesar&rdquo; untuk melihat lebih jelas
                    </p>
                    <div className="relative w-full rounded-xl overflow-hidden"
                      style={{ minHeight: '420px', border: '1px solid #EFF6FF' }}>
                      <Image
                        src={data.gambar}
                        alt="Struktur Organisasi Biro Organisasi NTT"
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 1024px) 100vw, 70vw"
                      />
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                {data.deskripsi && (
                  <div className="rounded-2xl p-6 reveal reveal-up reveal-delay-1"
                    style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 2px 12px rgba(13,71,161,0.05)' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
                      <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>Keterangan</h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>{data.deskripsi}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl p-12 text-center reveal reveal-up"
                style={{ background: 'white', border: '1px solid #DBEAFE' }}>
                <Building2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#BFDBFE' }} />
                <p className="text-sm font-semibold" style={{ color: '#94A3B8' }}>Bagan struktur organisasi belum tersedia.</p>
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
                  const isActive = item.href === '/profil/struktur-organisasi'
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