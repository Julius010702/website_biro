// components/sections/BeritaSection.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
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
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 rounded-full" style={{ background: '#1a3c6e' }} />
              <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                Informasi Terkini
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-gray-800"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
            >
              Berita Terbaru
            </h2>
          </div>

          <Link
            href="/berita"
            className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg transition-all hover:brightness-110 active:scale-95 text-white"
            style={{ background: '#1a3c6e' }}
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Card Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {beritaList.map((b, i) => (
            <Link
              key={b.id}
              href={`/berita/${b.slug ?? b.id}`}
              className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              style={{ textDecoration: 'none' }}
            >
              {/* Gambar */}
              <div className="relative overflow-hidden" style={{ height: '196px', flexShrink: 0 }}>
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
                {/* Kategori badge */}
                {b.kategori && (
                  <span
                    className="absolute top-3 left-3 text-[9px] font-black px-2 py-0.5 rounded tracking-wider uppercase"
                    style={{ background: '#1a3c6e', color: '#fff' }}
                  >
                    {b.kategori}
                  </span>
                )}
              </div>

              {/* Konten */}
              <div className="flex flex-col flex-1 p-4 gap-2">
                {/* Tanggal */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {format(new Date(b.createdAt), 'dd MMM yyyy', { locale: localeId })}
                </div>

                {/* Judul */}
                <h3 className="text-sm font-semibold leading-snug text-gray-800 line-clamp-3 group-hover:text-blue-900 transition-colors flex-1">
                  {b.judul}
                </h3>

                {/* CTA */}
                <div
                  className="mt-2 pt-3 text-xs font-bold flex items-center gap-1 transition-all group-hover:gap-2"
                  style={{ borderTop: '1px solid #f0f0f0', color: '#1a3c6e' }}
                >
                  Lanjut Baca
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile bottom CTA (duplikat untuk UX) */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg text-white active:scale-95"
            style={{ background: '#1a3c6e' }}
          >
            Lihat Semua Berita <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}