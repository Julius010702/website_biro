import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Globe } from 'lucide-react'
import { footerLinks } from '@/lib/navigation'
import SitusThumbnailSlide from '@/components/shared/SitusThumbnailSlide'

const heroBg = [
  '/images/hero/gedung-pemprov.jpeg',
  '/images/hero/wae-rebo.jpeg',
  '/images/hero/sumba-tarung.jpeg',
  '/images/hero/komodo-padar.jpeg',
  '/images/hero/geowisata-timor.jpeg',
  '/images/hero/panorama-laut.jpeg',
]

const cardAccents = [
  '#F5A623',
  '#34D399',
  '#FBBF24',
  '#38BDF8',
  '#FB923C',
  '#C084FC',
  '#F472B6',
  '#4ADE80',
  '#60A5FA',
  '#A78BFA',
]

type SitusItem = {
  label: string
  href: string
  external?: boolean
  thumbnail?: string | string[]
  favicon?: string
}

export default function SitusTerkaitSection() {
  const sites = footerLinks.situsTerkait as SitusItem[]

  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: '#06101E' }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 flex opacity-[0.10]">
          {heroBg.map((src, i) => (
            <div key={i} className="relative flex-1 overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" sizes="16vw" />
            </div>
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,16,30,0.97) 0%, rgba(8,26,62,0.94) 50%, rgba(6,16,30,0.97) 100%)',
          }}
        />
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.02 }}>
          <defs>
            <pattern id="situs-scan" x="0" y="0" width="100%" height="4" patternUnits="userSpaceOnUse">
              <line x1="0" y1="2" x2="100%" y2="2" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#situs-scan)" />
        </svg>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.45), transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.35), transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(13,71,161,0.18) 0%, transparent 65%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(245,166,35,0.08)',
              border: '1px solid rgba(245,166,35,0.22)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Globe className="w-3 h-3" style={{ color: '#F5A623' }} />
            <span
              className="text-[10px] font-black tracking-[0.25em] uppercase"
              style={{ color: '#F5A623' }}
            >
              Tautan Resmi
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
          >
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

        {/* ── Cards ── */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {sites.map((site, i) => {
            const accent = cardAccents[i % cardAccents.length]
            const thumbs: string[] = site.thumbnail
              ? Array.isArray(site.thumbnail)
                ? site.thumbnail
                : [site.thumbnail]
              : []

            return (
              <Link
                key={site.href}
                href={site.href}
                target={site.external ? '_blank' : undefined}
                rel={site.external ? 'noopener noreferrer' : undefined}
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
                {/* Top accent bar on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />

                {/* ── Thumbnail Slide ── */}
                <div className="relative w-full overflow-hidden" style={{ height: '96px' }}>
                  <SitusThumbnailSlide
                    images={thumbs}
                    alt={site.label}
                    accent={accent}
                    initials={site.label.slice(0, 2).toUpperCase()}
                    label={site.label}
                  />
                </div>

                {/* ── Card body ── */}
                <div className="flex flex-col items-center gap-1.5 px-3 py-3">
                  <p
                    className="text-[11px] font-bold leading-snug text-center transition-colors group-hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    {site.label}
                  </p>
                  {site.external && (
                    <div
                      className="flex items-center gap-1 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0"
                      style={{ color: accent }}
                    >
                      Kunjungi <ExternalLink className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Bottom glow */}
                <div
                  className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: accent }}
                />

                {/* Border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${accent}25` }}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}