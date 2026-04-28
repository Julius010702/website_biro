// app/(main)/profil/sekapur-sirih/page.tsx
import { prisma }   from '@/lib/prisma'
import Image        from 'next/image'
import Link         from 'next/link'
import { User, Quote, ChevronRight, BookOpen, Building2, FileText, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tentang Kami — Biro Organisasi NTT' }

const profilMenu = [
  { label: 'Tentang Kami',          href: '/profil/sekapur-sirih',       icon: <User       className="w-4 h-4" /> },
  { label: 'Struktur Organisasi',   href: '/profil/struktur-organisasi', icon: <Users      className="w-4 h-4" /> },
  { label: 'Tugas Pokok & Fungsi',  href: '/profil/tupoksi',             icon: <FileText   className="w-4 h-4" /> },
  { label: 'Bagian',                href: '/profil/bagian',              icon: <Building2  className="w-4 h-4" /> },
]

export default async function SekapurSirihPage() {
  const data = await prisma.sekapurSirih.findFirst({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main style={{ background: '#F4F7FD', minHeight: '100vh' }}>

      {/* ── Hero Header ── */}
      <section className="relative py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2342 0%, #0D47A1 55%, #1565C0 100%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
          <defs><pattern id="profil-dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#profil-dot)" />
        </svg>
        {/* Decorative circle */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 65%)' }} />

        <div className="relative max-w-screen-2xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/50 mb-6 reveal reveal-up">
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white/80 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Profil</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 font-medium">Tentang Kami</span>
          </div>

          <div className="flex items-start gap-4 reveal reveal-up reveal-delay-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)' }}>
              <BookOpen className="w-6 h-6" style={{ color: '#F5A623' }} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 mb-1">Profil</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white"
                style={{ fontFamily: 'var(--font-heading)' }}>
                Tentang Kami
              </h1>
              <p className="text-sm text-white/55 mt-1.5 max-w-xl">
                Sambutan dan pengantar dari pimpinan Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur.
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
                {/* Photo + Identity Card */}
                {(data.foto || data.nama) && (
                  <div className="rounded-2xl overflow-hidden reveal reveal-left"
                    style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 4px 24px rgba(13,71,161,0.09)' }}>

                    <div className="flex flex-col sm:flex-row">
                      {/* Photo */}
                      {data.foto && (
                        <div className="relative shrink-0 sm:w-56"
                          style={{ minHeight: '280px', background: 'linear-gradient(160deg, #0D47A1, #1976D2)' }}>
                          <Image src={data.foto} alt={data.nama ?? 'Kepala Biro'} fill
                            className="object-cover object-top" sizes="224px" />
                          {/* Bottom gradient overlay */}
                          <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.6) 0%, transparent 50%)' }} />
                          {/* Badge */}
                          <div className="absolute bottom-4 left-4">
                            <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
                              style={{ background: 'rgba(245,166,35,0.9)', color: '#0A2342' }}>
                              Kepala Biro
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Identity info */}
                      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full self-start text-[10px] font-black tracking-widest uppercase"
                          style={{ background: '#EFF6FF', color: '#1565C0', border: '1px solid #BFDBFE' }}>
                          <Quote className="w-3 h-3" />
                          Sambutan Pimpinan
                        </div>

                        {data.nama && (
                          <h2 className="text-2xl font-bold leading-tight"
                            style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
                            {data.nama}
                          </h2>
                        )}
                        {data.jabatan && (
                          <p className="text-sm mt-1.5 font-medium" style={{ color: '#64748B' }}>
                            {data.jabatan}
                          </p>
                        )}

                        <div className="flex items-center gap-1.5 mt-4">
                          <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
                          <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
                        </div>

                        {/* Decorative quote mark */}
                        <div className="mt-5 pt-5" style={{ borderTop: '1px solid #EFF6FF' }}>
                          <p className="text-xs text-slate-400 leading-relaxed italic">
                            &ldquo;Biro Organisasi Setda NTT berkomitmen mendukung tata kelola pemerintahan yang efektif, efisien, dan akuntabel demi kesejahteraan masyarakat Nusa Tenggara Timur.&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Konten sambutan */}
                <div className="rounded-2xl overflow-hidden reveal reveal-up"
                  style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 2px 16px rgba(13,71,161,0.07)' }}>

                  {/* Card header */}
                  <div className="px-6 sm:px-8 py-4 flex items-center gap-3"
                    style={{ background: 'linear-gradient(90deg, #EFF6FF, #F8FAFF)', borderBottom: '1px solid #DBEAFE' }}>
                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
                    <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>{data.judul}</h3>
                  </div>

                  {/* Konten */}
                  <div className="px-6 sm:px-8 py-6">
                    <div
                      className="prose prose-sm max-w-none prose-headings:text-blue-900 prose-a:text-blue-700 prose-strong:text-blue-900"
                      style={{ color: '#374151', lineHeight: '1.9' }}
                      dangerouslySetInnerHTML={{ __html: data.konten }}
                    />
                  </div>

                  {/* Footer card */}
                  {data.nama && (
                    <div className="px-6 sm:px-8 py-4 flex items-center gap-3"
                      style={{ background: '#F8FAFF', borderTop: '1px solid #EFF6FF' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                        <User className="w-4 h-4" style={{ color: '#1565C0' }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: '#0A2342' }}>{data.nama}</p>
                        {data.jabatan && <p className="text-[10px]" style={{ color: '#94A3B8' }}>{data.jabatan}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl p-12 text-center reveal reveal-up"
                style={{ background: 'white', border: '1px solid #DBEAFE' }}>
                <User className="w-12 h-12 mx-auto mb-3" style={{ color: '#BFDBFE' }} />
                <p className="text-sm font-semibold" style={{ color: '#94A3B8' }}>Konten belum tersedia.</p>
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
                  const isActive = item.href === '/profil/sekapur-sirih'
                  return (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group"
                      style={{
                        background:    isActive ? '#EFF6FF'     : 'transparent',
                        color:         isActive ? '#0D47A1'     : '#475569',
                        borderLeft:    isActive ? '3px solid #0D47A1' : '3px solid transparent',
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