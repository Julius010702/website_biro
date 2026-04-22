// app/(public)/berita/page.tsx
import { prisma }        from '@/lib/prisma'
import Link              from 'next/link'
import type { Metadata } from 'next'
import { formatDistanceToNow, format } from 'date-fns'
import { id as localeId }              from 'date-fns/locale'
import { Clock, Eye, ChevronRight, ChevronLeft, Search, Newspaper } from 'lucide-react'
import BeritaImage, { GambarPlaceholder } from '@/components/shared/BeritaImage'

export const metadata: Metadata = {
  title: 'Berita',
  description: 'Berita dan informasi terkini Biro Organisasi Setda Provinsi Nusa Tenggara Timur',
}

const PER_PAGE = 9

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; halaman?: string; q?: string }>
}) {
  const { kategori: katParam, halaman: halamanParam, q: queryParam } = await searchParams

  const halaman  = Math.max(1, parseInt(halamanParam ?? '1') || 1)
  const skip     = (halaman - 1) * PER_PAGE

  // ── Where clause ──────────────────────────────────────────────────────────
  const where: {
    publish: boolean
    kategori?: string
    OR?: Array<{ judul?: { contains: string; mode: 'insensitive' }; ringkasan?: { contains: string; mode: 'insensitive' } }>
  } = { publish: true }

  if (katParam)    where.kategori = katParam
  if (queryParam)  where.OR = [
    { judul:    { contains: queryParam, mode: 'insensitive' } },
    { ringkasan: { contains: queryParam, mode: 'insensitive' } },
  ]

  // ── Query paralel ─────────────────────────────────────────────────────────
  const [beritaList, total, kategoriRaw, beritaUtama] = await Promise.all([
    prisma.berita.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PER_PAGE,
      select: {
        id: true, judul: true, slug: true, ringkasan: true,
        gambar: true, kategori: true, createdAt: true, views: true,
      },
    }),
    prisma.berita.count({ where }),
    // Semua kategori unik
    prisma.berita.findMany({
      where:  { publish: true, kategori: { not: null } },
      select: { kategori: true },
      distinct: ['kategori'],
    }),
    // Berita utama (featured) — hanya di halaman 1 tanpa filter
    !katParam && !queryParam && halaman === 1
      ? prisma.berita.findFirst({
          where:   { publish: true },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, judul: true, slug: true, ringkasan: true,
            gambar: true, kategori: true, createdAt: true, views: true,
          },
        })
      : Promise.resolve(null),
  ])

  const totalHalaman   = Math.ceil(total / PER_PAGE)
  const kategoriList   = kategoriRaw.map((k) => k.kategori).filter(Boolean) as string[]

  // Jika ada featured, hilangkan dari list utama
  const displayList = beritaUtama
    ? beritaList.filter((b) => b.id !== beritaUtama.id)
    : beritaList

  // ── Build URL helper ───────────────────────────────────────────────────────
  function buildUrl(params: { halaman?: number; kategori?: string; q?: string }) {
    const p = new URLSearchParams()
    if (params.kategori ?? katParam)  p.set('kategori', params.kategori ?? katParam ?? '')
    if (params.q ?? queryParam)       p.set('q', params.q ?? queryParam ?? '')
    const h = params.halaman ?? halaman
    if (h > 1) p.set('halaman', String(h))
    const qs = p.toString()
    return `/berita${qs ? `?${qs}` : ''}`
  }

  return (
    <main style={{ background: '#F4F7FD', minHeight: '100vh' }}>

      {/* ── Hero bar ── */}
      <section
        className="relative py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2342 0%, #0D47A1 55%, #1565C0 100%)' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="b-dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#b-dot)" />
        </svg>
        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/50 mb-5">
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-white/80 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Berita</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">Biro Organisasi NTT</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Berita & Informasi
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-0.75 rounded-full bg-white/70" />
                <div className="w-3 h-0.75 rounded-full bg-yellow-400" />
              </div>
            </div>

            {/* Search bar */}
            <form method="GET" action="/berita" className="flex items-center gap-2 w-full sm:w-72">
              {katParam && <input type="hidden" name="kategori" value={katParam} />}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                <input
                  type="text"
                  name="q"
                  defaultValue={queryParam}
                  placeholder="Cari berita..."
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                style={{ background: '#F5A623', color: '#0A2342' }}
              >
                Cari
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Filter kategori ── */}
        {kategoriList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-7">
            <Link
              href={buildUrl({ kategori: '', halaman: 1 })}
              className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full transition-all"
              style={{
                background: !katParam ? '#0D47A1' : 'white',
                color:      !katParam ? 'white'   : '#1565C0',
                border: '1px solid #DBEAFE',
              }}
            >
              Semua
            </Link>
            {kategoriList.map((kat) => (
              <Link
                key={kat}
                href={buildUrl({ kategori: kat, halaman: 1 })}
                className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full transition-all"
                style={{
                  background: katParam === kat ? '#0D47A1' : 'white',
                  color:      katParam === kat ? 'white'   : '#1565C0',
                  border: '1px solid #DBEAFE',
                }}
              >
                {kat}
              </Link>
            ))}
          </div>
        )}

        {/* ── Info hasil pencarian ── */}
        {(queryParam || katParam) && (
          <div className="flex items-center gap-2 mb-5">
            <p className="text-xs text-slate-500">
              Menampilkan <strong>{total}</strong> berita
              {queryParam && <> untuk <strong>&quot;{queryParam}&quot;</strong></>}
              {katParam   && <> dalam kategori <strong>{katParam}</strong></>}
            </p>
            <Link
              href="/berita"
              className="text-[11px] font-semibold text-red-500 hover:text-red-700 underline"
            >
              Reset
            </Link>
          </div>
        )}

        {/* ── Featured berita (halaman 1, tanpa filter) ── */}
        {beritaUtama && (
          <Link
            href={`/berita/${beritaUtama.slug}`}
            className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl mb-8 hover:-translate-y-1 hover:shadow-xl transition-all"
            style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 2px 16px rgba(13,71,161,0.07)', textDecoration: 'none' }}
          >
            {/* Gambar */}
            <div className="relative sm:w-2/5 overflow-hidden" style={{ minHeight: '220px' }}>
              {beritaUtama.gambar
                ? <BeritaImage src={beritaUtama.gambar} alt={beritaUtama.judul} fill
                    sizes="(max-width: 640px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105" />
                : <GambarPlaceholder size="lg" />
              }
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(255,255,255,0.05))' }} />
              <span
                className="absolute top-3 left-3 text-[9px] font-black px-2.5 py-1 rounded-lg tracking-wider"
                style={{ background: '#F5A623', color: '#0A2342' }}
              >
                UTAMA
              </span>
              {beritaUtama.kategori && (
                <span
                  className="absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.92)', color: '#0D47A1' }}
                >
                  {beritaUtama.kategori}
                </span>
              )}
            </div>

            {/* Konten */}
            <div className="flex flex-col justify-center flex-1 p-6 sm:p-8 gap-3">
              <h2
                className="text-lg sm:text-xl font-bold leading-snug line-clamp-3 transition-colors group-hover:text-blue-700"
                style={{ color: '#0A2342' }}
              >
                {beritaUtama.judul}
              </h2>
              {beritaUtama.ringkasan && (
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{beritaUtama.ringkasan}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {format(new Date(beritaUtama.createdAt), 'd MMMM yyyy', { locale: localeId })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {beritaUtama.views.toLocaleString()} kali dibaca
                </span>
              </div>
              <div
                className="mt-1 pt-3 flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
                style={{ borderTop: '1px solid #EEF3FC', color: '#0D47A1' }}
              >
                Baca Selengkapnya <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        )}

        {/* ── Grid berita ── */}
        {displayList.length === 0 && !beritaUtama ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ background: 'white', border: '1px solid #DBEAFE' }}
          >
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-slate-200" />
            <p className="text-sm font-semibold text-slate-400 mb-1">Tidak ada berita ditemukan</p>
            <p className="text-xs text-slate-300">Coba ubah kata kunci atau kategori pencarian</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayList.map((b) => (
              <Link
                key={b.id}
                href={`/berita/${b.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all"
                style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 2px 12px rgba(13,71,161,0.06)', textDecoration: 'none' }}
              >
                {/* Gambar */}
                <div className="relative overflow-hidden shrink-0" style={{ height: '180px' }}>
                  {b.gambar
                    ? <BeritaImage src={b.gambar} alt={b.judul} fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    : <GambarPlaceholder size="md" />
                  }
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.65) 0%, transparent 55%)' }}
                  />
                  {b.kategori && (
                    <span
                      className="absolute bottom-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.92)', color: '#0D47A1' }}
                    >
                      {b.kategori}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <h3
                    className="text-sm font-bold leading-snug line-clamp-3 transition-colors group-hover:text-blue-700"
                    style={{ color: '#0A2342' }}
                  >
                    {b.judul}
                  </h3>
                  {b.ringkasan && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{b.ringkasan}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2.5 text-[10px] text-slate-400" style={{ borderTop: '1px solid #EEF3FC' }}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(b.createdAt), { locale: localeId, addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {b.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalHalaman > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {/* Prev */}
            {halaman > 1 && (
              <Link
                href={buildUrl({ halaman: halaman - 1 })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                style={{ background: 'white', color: '#0D47A1', border: '1px solid #DBEAFE' }}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
              </Link>
            )}

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalHalaman }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalHalaman || Math.abs(p - halaman) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === 'ellipsis' ? (
                    <span key={`e-${i}`} className="px-2 text-slate-400 text-xs">…</span>
                  ) : (
                    <Link
                      key={p}
                      href={buildUrl({ halaman: p as number })}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{
                        background: p === halaman ? '#0D47A1' : 'white',
                        color:      p === halaman ? 'white'   : '#1565C0',
                        border: '1px solid #DBEAFE',
                      }}
                    >
                      {p}
                    </Link>
                  )
                )}
            </div>

            {/* Next */}
            {halaman < totalHalaman && (
              <Link
                href={buildUrl({ halaman: halaman + 1 })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                style={{ background: '#0D47A1', color: 'white', border: '1px solid #0D47A1' }}
              >
                Berikutnya <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        {/* Info total */}
        {total > 0 && (
          <p className="text-center text-[11px] text-slate-400 mt-4">
            Menampilkan {skip + 1}–{Math.min(skip + PER_PAGE, total)} dari {total} berita
          </p>
        )}
      </div>
    </main>
  )
}