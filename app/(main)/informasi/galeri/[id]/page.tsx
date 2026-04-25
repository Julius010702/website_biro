// app/(public)/informasi/galeri/[id]/page.tsx
import { prisma }        from '@/lib/prisma'
import { notFound }      from 'next/navigation'
import Link              from 'next/link'
import Image             from 'next/image'
import type { Metadata } from 'next'
import {
  ChevronRight, ArrowLeft, Camera, Film,
  Tag, Images, ExternalLink,
} from 'lucide-react'

// ─── Generate metadata ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const galeri = await prisma.galeri.findUnique({
    where:  { id, aktif: true },
    select: { judul: true, deskripsi: true, thumbnail: true, url: true },
  })
  if (!galeri) return { title: 'Galeri Tidak Ditemukan' }

  return {
    title:       galeri.judul,
    description: galeri.deskripsi ?? galeri.judul,
    openGraph: {
      title:       galeri.judul,
      description: galeri.deskripsi ?? '',
      images:      galeri.thumbnail ? [galeri.thumbnail] : [galeri.url],
    },
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function GaleriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const galeri = await prisma.galeri.findUnique({
    where: { id, aktif: true },
  })
  if (!galeri) notFound()

  // Galeri lainnya (selain diri sendiri)
  const lainnya = await prisma.galeri.findMany({
    where: { aktif: true, id: { not: galeri.id } },
    orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
    take: 8,
    select: {
      id: true, judul: true, tipe: true,
      url: true, thumbnail: true, tags: true,
      urutan: true, createdAt: true, aktif: true, deskripsi: true,
    },
  })

  const isVideo = galeri.tipe === 'VIDEO'

  return (
    <main style={{ background: '#050D1A', minHeight: '100vh' }}>

      {/* ── Hero media ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ maxHeight: '520px', minHeight: '320px', background: '#020810' }}
      >
        {isVideo ? (
          /* Video embed atau thumbnail dengan link */
          <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: '320px', height: '480px' }}>
            <Image
              src={galeri.thumbnail ?? '/images/hero/panorama-laut.jpeg'}
              alt={galeri.judul}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(5,13,26,0.90) 0%, rgba(5,13,26,0.50) 55%, transparent 100%)' }}
            />
            <a
              href={galeri.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex flex-col items-center gap-3 group"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: 'rgba(245,166,35,0.90)', backdropFilter: 'blur(8px)' }}
              >
                <Film className="w-7 h-7" style={{ color: '#050D1A' }} />
              </div>
              <span
                className="text-xs font-bold flex items-center gap-1.5 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.30)' }}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Tonton Video
              </span>
            </a>
          </div>
        ) : (
          <div className="relative w-full" style={{ height: '480px' }}>
            <Image
              src={galeri.url}
              alt={galeri.judul}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(5,13,26,0.85) 0%, rgba(5,13,26,0.25) 55%, transparent 100%)' }}
            />
          </div>
        )}

        {/* Breadcrumb di atas */}
        <div className="absolute top-0 left-0 right-0 px-4 py-4 z-10">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-white/50">
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-white/80 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/informasi/galeri" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-white/80 transition-colors">Galeri</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70 truncate max-w-48">{galeri.judul}</span>
          </div>
        </div>

        {/* Judul di bawah media */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-5 h-5 rounded flex items-center justify-center"
                style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.30)' }}
              >
                {isVideo
                  ? <Film className="w-3 h-3" style={{ color: '#F5A623' }} />
                  : <Camera className="w-3 h-3" style={{ color: '#38BDF8' }} />
                }
              </div>
              <span
                className="text-[10px] font-black tracking-[0.2em] uppercase"
                style={{ color: isVideo ? '#F5A623' : '#38BDF8' }}
              >
                {isVideo ? 'Video' : 'Foto'}
              </span>
            </div>
            <h1
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {galeri.judul}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Konten utama ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Deskripsi */}
            {galeri.deskripsi && (
              <div
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
                  {galeri.deskripsi}
                </p>
              </div>
            )}

            {/* Tags */}
            {galeri.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.30)' }} />
                {galeri.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/informasi/galeri?q=${encodeURIComponent(tag)}`}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:scale-105"
                    style={{
                      background: 'rgba(56,189,248,0.08)',
                      color: '#38BDF8',
                      border: '1px solid rgba(56,189,248,0.20)',
                      textDecoration: 'none',
                    }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Link ke media asli (foto) */}
            {!isVideo && (
              <a
                href={galeri.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start text-xs font-semibold px-4 py-2.5 rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'rgba(56,189,248,0.08)',
                  color: '#38BDF8',
                  border: '1px solid rgba(56,189,248,0.20)',
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Lihat Gambar Asli
              </a>
            )}

            {/* Navigasi kembali */}
            <div className="pt-2">
              <Link
                href="/informasi/galeri"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.60)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Semua Galeri
              </Link>
            </div>
          </div>

          {/* ── Sidebar: Galeri lainnya ── */}
          <aside className="flex flex-col gap-4">
            <div
              className="rounded-2xl overflow-hidden sticky top-24"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Header sidebar */}
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(5,13,26,0.95), rgba(8,26,60,0.95))',
                  borderBottom: '1px solid rgba(56,189,248,0.12)',
                }}
              >
                <Images className="w-4 h-4" style={{ color: '#38BDF8' }} />
                <h2 className="text-xs font-bold text-white">Galeri Lainnya</h2>
              </div>

              {lainnya.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>Tidak ada galeri lainnya.</p>
                </div>
              ) : (
                <div
                  className="grid grid-cols-2 gap-1.5 p-2.5"
                >
                  {lainnya.map((g) => (
                    <Link
                      key={g.id}
                      href={`/informasi/galeri/${g.id}`}
                      className="group relative overflow-hidden rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        aspectRatio: '4/3',
                        border: '1px solid rgba(255,255,255,0.06)',
                        textDecoration: 'none',
                        display: 'block',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={g.thumbnail ?? g.url}
                        alt={g.judul}
                        fill
                        sizes="(max-width: 1024px) 25vw, 15vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0" style={{ background: 'rgba(5,13,26,0.25)' }} />
                      {/* Hover overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-1.5"
                        style={{ background: 'linear-gradient(to top, rgba(5,13,26,0.88), transparent)' }}
                      >
                        <span className="text-white text-[9px] font-semibold line-clamp-2 leading-tight">{g.judul}</span>
                      </div>
                      {g.tipe === 'VIDEO' && (
                        <div
                          className="absolute top-1 right-1 w-4 h-4 rounded flex items-center justify-center"
                          style={{ background: 'rgba(245,166,35,0.85)' }}
                        >
                          <Film className="w-2.5 h-2.5" style={{ color: '#050D1A' }} />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              <div className="p-2.5 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Link
                  href="/informasi/galeri"
                  className="block text-center text-xs font-semibold py-2.5 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: 'rgba(56,189,248,0.08)',
                    color: '#38BDF8',
                    border: '1px solid rgba(56,189,248,0.15)',
                  }}
                >
                  Lihat Semua Galeri →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}