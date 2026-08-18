// app/components/sections/SitusTerkaitSection.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Globe, Monitor } from 'lucide-react'
import { prisma } from '@/lib/prisma'

const heroBg = [
  '/images/hero/gedung-pemprov.jpeg',
  '/images/hero/wae-rebo.jpeg',
  '/images/hero/sumba-tarung.jpeg',
  '/images/hero/komodo-padar.jpeg',
  '/images/hero/geowisata-timor.jpeg',
  '/images/hero/panorama-laut.jpeg',
]

const cardAccents = [
  '#F5A623', '#34D399', '#FBBF24', '#38BDF8',
  '#FB923C', '#C084FC', '#F472B6', '#4ADE80',
  '#60A5FA', '#A78BFA',
]

export default async function SitusTerkaitSection() {
  const sites = await prisma.daftarAplikasi.findMany({
    where:   { aktif: true },
    orderBy: [{ urutan: 'asc' }, { createdAt: 'asc' }],
  })

  if (sites.length === 0) return null

  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: '#06101E' }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 flex opacity-[0.10]">
          {heroBg.map((src, i) => (
            <div key={i} className="relative flex-1 overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" sizes="16vw" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(6,16,30,0.97) 0%, rgba(8,26,62,0.94) 50%, rgba(6,16,30,0.97) 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.45), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.35), transparent)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.22)', backdropFilter: 'blur(8px)' }}>
            <Globe className="w-3 h-3" style={{ color: '#F5A623' }} />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: '#F5A623' }}>Tautan Resmi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            DAFTAR APLIKASI
          </h2>
          <p className="text-xs sm:text-sm max-w-xs mx-auto mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Akses layanan dan sistem informasi pemerintah NTT
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
            <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {sites.map((site, i) => {
            const accent = cardAccents[i % cardAccents.length]
            return (
              <Link
                key={site.id}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  width: '160px',
                }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

                {/* Logo/Thumbnail */}
                <div className="relative w-full flex items-center justify-center bg-white/5" style={{ height: '96px' }}>
                  {site.logo ? (
                    <Image
                      src={site.logo}
                      alt={site.nama}
                      width={120}
                      height={80}
                      className="object-contain p-2"
                      sizes="160px"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Monitor className="w-8 h-8" style={{ color: accent }} />
                      <span className="text-[10px] font-black" style={{ color: accent }}>
                        {site.nama.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="flex flex-col items-center gap-1.5 px-3 py-3">
                  <p className="text-[11px] font-bold leading-snug text-center transition-colors group-hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {site.nama}
                  </p>
                  {site.kategori && (
                    <p className="text-[9px] font-semibold" style={{ color: accent }}>{site.kategori}</p>
                  )}
                  <div className="flex items-center gap-1 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0"
                    style={{ color: accent }}>
                    Kunjungi <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: accent }} />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${accent}25` }} />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}