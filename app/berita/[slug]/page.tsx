// app/(public)/berita/[slug]/page.tsx
import { prisma }        from '@/lib/prisma'
import { notFound }      from 'next/navigation'
import Link              from 'next/link'
import Image             from 'next/image'
import type { Metadata } from 'next'
import { format }        from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import {
  Clock, Eye, Tag, ChevronRight,
  ArrowLeft, Share2, Newspaper,
} from 'lucide-react'
import BeritaImage, { GambarPlaceholder } from '@/components/shared/BeritaImage'

// ─── Generate metadata ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const berita = await prisma.berita.findUnique({
    where:  { slug, publish: true },
    select: { judul: true, ringkasan: true, gambar: true },
  })
  if (!berita) return { title: 'Berita Tidak Ditemukan' }

  return {
    title:       berita.judul,
    description: berita.ringkasan ?? berita.judul,
    openGraph: {
      title:       berita.judul,
      description: berita.ringkasan ?? '',
      images:      berita.gambar ? [berita.gambar] : [],
    },
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const berita = await prisma.berita.findUnique({
    where: { slug, publish: true },
  })
  if (!berita) notFound()

  // Increment views (fire and forget)
  prisma.berita.update({
    where: { id: berita.id },
    data:  { views: { increment: 1 } },
  }).catch(() => {})

  // Berita terkait (sama kategori, bukan diri sendiri)
  const terkait = await prisma.berita.findMany({
    where: {
      publish: true,
      id:      { not: berita.id },
      ...(berita.kategori ? { kategori: berita.kategori } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take:    4,
    select:  { id: true, judul: true, slug: true, gambar: true, createdAt: true, kategori: true },
  })

  return (
    <main style={{ background: '#F4F7FD', minHeight: '100vh' }}>

      {/* ── Hero gambar ── */}
      {berita.gambar && (
        <div className="relative w-full overflow-hidden" style={{ height: '420px' }}>
          <Image
            src={berita.gambar}
            alt={berita.judul}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.90) 0%, rgba(10,35,66,0.45) 55%, transparent 100%)' }}
          />
          {/* Breadcrumb di atas gambar */}
          <div className="absolute top-0 left-0 right-0 px-4 py-4">
            <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-white/60">
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-white/90">Beranda</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/berita" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-white/90">Berita</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/80 truncate max-w-48">{berita.judul}</span>
            </div>
          </div>
          {/* Judul di bawah gambar */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
            <div className="max-w-4xl mx-auto">
              {berita.kategori && (
                <span
                  className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg mb-3"
                  style={{ background: '#F5A623', color: '#0A2342' }}
                >
                  {berita.kategori}
                </span>
              )}
              <h1
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {berita.judul}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Breadcrumb (jika tidak ada gambar) ── */}
        {!berita.gambar && (
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-blue-600">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/berita" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-blue-600">Berita</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 truncate">{berita.judul}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Artikel utama ── */}
          <article className="lg:col-span-2 flex flex-col gap-5">

            {/* Judul (jika tidak ada gambar) */}
            {!berita.gambar && (
              <h1
                className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}
              >
                {berita.judul}
              </h1>
            )}

            {/* Meta info */}
            <div
              className="flex flex-wrap items-center gap-3 py-3 text-xs text-slate-400"
              style={{ borderTop: '1px solid #EEF3FC', borderBottom: '1px solid #EEF3FC' }}
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {format(new Date(berita.createdAt), "d MMMM yyyy, HH.mm 'WITA'", { locale: localeId })}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {(berita.views + 1).toLocaleString()} kali dibaca
              </span>
              {berita.penulis && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  Oleh: <strong className="text-slate-500">{berita.penulis}</strong>
                </span>
              )}
            </div>

            {/* Ringkasan */}
            {berita.ringkasan && (
              <div
                className="p-4 rounded-xl text-sm leading-relaxed font-medium italic"
                style={{ background: '#EFF6FF', borderLeft: '3px solid #0D47A1', color: '#1E3A5F' }}
              >
                {berita.ringkasan}
              </div>
            )}

            {/* Konten artikel */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: 'white', border: '1px solid #DBEAFE' }}
            >
              <div
                className="prose prose-sm sm:prose max-w-none"
                style={{ color: '#374151' }}
                dangerouslySetInnerHTML={{ __html: berita.konten }}
              />
            </div>

            {/* Tags */}
            {berita.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {berita.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/berita?q=${encodeURIComponent(tag)}`}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:scale-105"
                    style={{ background: '#EFF6FF', color: '#1565C0', border: '1px solid #DBEAFE', textDecoration: 'none' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Nav bawah */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
                style={{ background: 'white', color: '#0D47A1', border: '1px solid #DBEAFE' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Semua Berita
              </Link>
              <button
                onClick={undefined}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
                style={{ background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}
              >
                <Share2 className="w-3.5 h-3.5" /> Bagikan
              </button>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-5">

            {/* Berita terkait */}
            <div
              className="rounded-2xl overflow-hidden sticky top-24"
              style={{ background: 'white', border: '1px solid #DBEAFE' }}
            >
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #0A2342, #0D47A1)', borderBottom: '1px solid #DBEAFE' }}
              >
                <Newspaper className="w-4 h-4 text-yellow-400" />
                <h2 className="text-xs font-bold text-white">Berita Terkait</h2>
              </div>

              {terkait.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-slate-400">Tidak ada berita terkait.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {terkait.map((t) => (
                    <Link
                      key={t.id}
                      href={`/berita/${t.slug}`}
                      className="group flex gap-3 p-3.5 hover:bg-slate-50 transition-colors"
                      style={{ textDecoration: 'none' }}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        {t.gambar
                          ? <BeritaImage src={t.gambar} alt={t.judul} fill sizes="64px" className="object-cover" />
                          : <GambarPlaceholder size="sm" />
                        }
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold leading-snug line-clamp-3 mb-1 transition-colors group-hover:text-blue-700"
                          style={{ color: '#0A2342' }}
                        >
                          {t.judul}
                        </p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {format(new Date(t.createdAt), 'd MMM yyyy', { locale: localeId })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="p-3" style={{ borderTop: '1px solid #EEF3FC' }}>
                <Link
                  href="/berita"
                  className="block text-center text-xs font-semibold py-2.5 rounded-xl transition-all hover:scale-105"
                  style={{ background: '#EFF6FF', color: '#0D47A1' }}
                >
                  Lihat Semua Berita →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}