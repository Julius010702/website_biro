// components/sections/BeritaSection.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Clock, Newspaper } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import BeritaImage from '@/components/shared/BeritaImage'
import Image from 'next/image'

const heroBg = [
  '/images/hero/gedung-pemprov.jpeg',
  '/images/hero/wae-rebo.jpeg',
  '/images/hero/sumba-tarung.jpeg',
  '/images/hero/komodo-padar.jpeg',
  '/images/hero/geowisata-timor.jpeg',
  '/images/hero/panorama-laut.jpeg',
]

export default async function BeritaSection() {
  const beritaList = await prisma.berita.findMany({
    where:   { publish: true },
    orderBy: { createdAt: 'desc' },
    take:    8,
    select:  { id: true, judul: true, slug: true, createdAt: true, gambar: true, kategori: true },
  })

  if (beritaList.length === 0) return null

  return (
    <section
      className="relative py-12 sm:py-16 lg:py-20 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050D1A 0%, #081A3C 50%, #050D1A 100%)' }}
    >
      {/* Dot pattern background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.03 }}>
        <defs>
          <pattern id="berita-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#berita-dots)" />
      </svg>

      {/* Top + bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.30), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.20), transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded flex items-center justify-center"
                style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.28)' }}>
                <Newspaper className="w-3 h-3" style={{ color: '#F5A623' }} />
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: '#F5A623' }}>
                Informasi Terkini
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
            >
              Berita Terbaru
            </h2>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
              <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            </div>
          </div>

          <Link
            href="/berita"
            className="self-start sm:self-auto hidden sm:inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(245,166,35,0.10)',
              border: '1px solid rgba(245,166,35,0.28)',
              color: '#F5A623',
            }}
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Card Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {beritaList.map((b, i) => (
            <Link
              key={b.id}
              href={`/berita/${b.slug ?? b.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                textDecoration: 'none',
              }}
            >
              {/* Gambar */}
              <div className="relative overflow-hidden" style={{ height: '180px', flexShrink: 0 }}>
                {b.gambar ? (
                  <BeritaImage
                    src={b.gambar}
                    alt={b.judul}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={heroBg[i % heroBg.length]}
                    alt={b.judul}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {/* Gradient bawah gambar */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(5,13,26,0.60) 0%, transparent 55%)' }} />

                {/* Kategori badge */}
                {b.kategori && (
                  <span
                    className="absolute top-3 left-3 text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase"
                    style={{ background: '#F5A623', color: '#050D1A' }}
                  >
                    {b.kategori}
                  </span>
                )}

                {/* Hover ring */}
                <div className="absolute inset-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(245,166,35,0.25)' }} />
              </div>

              {/* Konten */}
              <div className="flex flex-col flex-1 p-4 gap-2">
                {/* Tanggal */}
                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <Clock className="w-3 h-3" />
                  {format(new Date(b.createdAt), 'dd MMM yyyy', { locale: localeId })}
                </div>

                {/* Judul */}
                <h3 className="text-sm font-semibold leading-snug line-clamp-3 flex-1 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F5A623')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}>
                  {b.judul}
                </h3>

                {/* CTA */}
                <div
                  className="mt-2 pt-3 text-xs font-bold flex items-center gap-1 transition-all group-hover:gap-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: '#F5A623' }}
                >
                  Lanjut Baca
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-7 text-center sm:hidden">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl active:scale-95"
            style={{ background: '#F5A623', color: '#050D1A' }}
          >
            Lihat Semua Berita <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}