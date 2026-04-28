// components/sections/GaleriSection.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Images, Camera } from 'lucide-react'

type GaleriItem = { id: string; judul: string; thumbnail: string | null; url: string }

export default async function GaleriSection() {
  let galeriList: GaleriItem[] = []
  try {
    galeriList = await (prisma as unknown as {
      galeri: { findMany: (args: object) => Promise<GaleriItem[]> }
    }).galeri.findMany({
      where:   { aktif: true },
      orderBy: { urutan: 'asc' },
      take:    8,
      select:  { id: true, judul: true, thumbnail: true, url: true },
    })
  } catch { return null }

  if (galeriList.length === 0) return null

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: '#050D1A' }}>

      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image src="/images/hero/panorama-laut.jpeg" alt="" fill
          className="object-cover opacity-[0.10]" sizes="100vw" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(5,13,26,0.97) 0%, rgba(8,26,60,0.93) 50%, rgba(5,13,26,0.97) 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.35), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.25), transparent)' }} />
      </div>

      {/* max-w-screen-2xl agar melebar di layar besar */}
      <div className="relative z-10 max-w-screen-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 reveal reveal-up">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded flex items-center justify-center"
                style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.28)' }}>
                <Camera className="w-3 h-3" style={{ color: '#38BDF8' }} />
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: '#38BDF8' }}>
                Dokumentasi
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
              Galeri Foto
            </h2>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: '#38BDF8' }} />
              <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            </div>
          </div>
          <Link href="/informasi/galeri"
            className="self-start sm:self-auto hidden sm:inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.28)', color: '#38BDF8', backdropFilter: 'blur(8px)' }}>
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid Desktop */}
        <div className="hidden sm:grid grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3"
          style={{ gridAutoRows: '160px' }}>
          {galeriList.map((g, i) => (
            <Link key={g.id} href="/informasi/galeri"
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
              style={{ border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.45)', textDecoration: 'none' }}>
              <Image src={g.thumbnail ?? g.url} alt={g.judul} fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={i === 0 ? '(max-width: 768px) 66vw, 50vw' : '(max-width: 768px) 33vw, 25vw'} />
              <div className="absolute inset-0" style={{ background: 'rgba(5,13,26,0.15)' }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5"
                style={{ background: 'linear-gradient(to top, rgba(5,13,26,0.92), rgba(5,13,26,0.25) 65%, transparent)' }}>
                <span className="text-white text-xs font-semibold line-clamp-2 leading-snug">{g.judul}</span>
              </div>
              {i === 0 && (
                <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-lg tracking-widest uppercase"
                  style={{ background: '#38BDF8', color: '#050D1A' }}>
                  UNGGULAN
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Grid Mobile */}
        <div className="grid sm:hidden grid-cols-2 gap-2" style={{ gridAutoRows: '130px' }}>
          {galeriList.map((g, i) => (
            <Link key={g.id} href="/informasi/galeri"
              className="group relative overflow-hidden rounded-xl active:scale-[0.97] transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
              <Image src={g.thumbnail ?? g.url} alt={g.judul} fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="50vw" />
              <div className="absolute inset-0" style={{ background: 'rgba(5,13,26,0.2)' }} />
              {i === 0 && (
                <span className="absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest uppercase"
                  style={{ background: '#38BDF8', color: '#050D1A' }}>
                  UNGGULAN
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden text-center">
          <Link href="/informasi/galeri"
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl active:scale-95"
            style={{ background: '#38BDF8', color: '#050D1A' }}>
            <Images className="w-4 h-4" /> Lihat Semua Galeri
          </Link>
        </div>
      </div>
    </section>
  )
}