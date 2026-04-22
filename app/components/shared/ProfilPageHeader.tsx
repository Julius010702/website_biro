// components/shared/ProfilPageHeader.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

interface ProfilPageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  icon?: React.ReactNode
  breadcrumbs: Breadcrumb[]
  /** hero image index 0-5 to use as bg (maps to heroBg array) */
  bgIndex?: number
}

const heroBg = [
  '/images/hero/gedung-pemprov.jpeg',
  '/images/hero/wae-rebo.jpeg',
  '/images/hero/sumba-tarung.jpeg',
  '/images/hero/komodo-padar.jpeg',
  '/images/hero/geowisata-timor.jpeg',
  '/images/hero/panorama-laut.jpeg',
]

export default function ProfilPageHeader({
  eyebrow,
  title,
  description,
  icon,
  breadcrumbs,
  bgIndex = 0,
}: ProfilPageHeaderProps) {
  const bg = heroBg[bgIndex % heroBg.length]

  return (
    <div className="relative overflow-hidden" style={{ background: '#060F1E' }}>
      {/* Background hero image */}
      <Image
        src={bg}
        alt=""
        fill
        className="object-cover opacity-20"
        sizes="100vw"
        priority
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(6,15,30,0.95) 0%, rgba(10,35,80,0.88) 50%, rgba(13,71,161,0.80) 100%)',
        }}
      />

      {/* Diagonal line texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
        <defs>
          <pattern id="ph-lines" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <line x1="0" y1="50" x2="50" y2="0" stroke="#F5A623" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ph-lines)" />
      </svg>

      {/* Glow */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,71,161,0.30) 0%, transparent 65%)',
          transform: 'translate(25%,-25%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1.5 text-xs mb-7" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.30)' }} />}
              {crumb.href && i < breadcrumbs.length - 1 ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.50)' }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  style={{
                    color: i === breadcrumbs.length - 1 ? '#F5A623' : 'rgba(255,255,255,0.50)',
                    fontWeight: i === breadcrumbs.length - 1 ? 700 : 400,
                  }}
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        {/* Icon + Title row */}
        <div className="flex items-start gap-5">
          {icon && (
            <div
              className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(245,166,35,0.35)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                color: '#F5A623',
              }}
            >
              {icon}
            </div>
          )}

          <div>
            {eyebrow && (
              <p
                className="text-[10px] font-black tracking-[0.22em] uppercase mb-2"
                style={{ color: '#F5A623' }}
              >
                {eyebrow}
              </p>
            )}
            <h1
              className="text-2xl sm:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}
            >
              {title}
            </h1>
            {description && (
              <p
                className="mt-3 text-sm sm:text-base max-w-2xl leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.4), transparent)' }}
        />
      </div>
    </div>
  )
}