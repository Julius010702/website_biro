// app/(main)/informasi/galeri/page.tsx
import { prisma }        from '@/lib/prisma'
import Link              from 'next/link'
import Image             from 'next/image'
import type { Metadata } from 'next'
import { ChevronRight, ChevronLeft, Images, Camera, Film, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Galeri Foto & Video',
  description: 'Galeri foto dan video dokumentasi kegiatan Biro Organisasi Setda Provinsi Nusa Tenggara Timur',
}

const PER_PAGE = 12

export default async function GaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ tipe?: string; halaman?: string; q?: string }>
}) {
  const { tipe: tipeParam, halaman: halamanParam, q: queryParam } = await searchParams
  const halaman = Math.max(1, parseInt(halamanParam ?? '1') || 1)
  const skip    = (halaman - 1) * PER_PAGE

  const where: Parameters<typeof prisma.galeri.findMany>[0]['where'] = { aktif: true }
  if (tipeParam === 'FOTO' || tipeParam === 'VIDEO') where!.tipe = tipeParam
  if (queryParam) where!.OR = [
    { judul:     { contains: queryParam, mode: 'insensitive' } },
    { deskripsi: { contains: queryParam, mode: 'insensitive' } },
  ]

  const [galeriList, total] = await Promise.all([
    prisma.galeri.findMany({
      where, orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }], skip, take: PER_PAGE,
      select: { id: true, judul: true, deskripsi: true, tipe: true, url: true, thumbnail: true, tags: true, urutan: true, createdAt: true },
    }),
    prisma.galeri.count({ where }),
  ])

  const totalHalaman = Math.ceil(total / PER_PAGE)

  function buildUrl(params: { halaman?: number; tipe?: string; q?: string }) {
    const p = new URLSearchParams()
    const t = params.tipe !== undefined ? params.tipe : tipeParam
    if (t) p.set('tipe', t)
    const q = params.q !== undefined ? params.q : queryParam
    if (q) p.set('q', q)
    const h = params.halaman ?? halaman
    if (h > 1) p.set('halaman', String(h))
    const qs = p.toString()
    return `/informasi/galeri${qs ? `?${qs}` : ''}`
  }

  return (
    <main style={{ background: '#050D1A', minHeight: '100vh' }}>

      {/* Hero bar */}
      <section className="relative py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #050D1A 0%, #081A3C 55%, #050D1A 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/hero/panorama-laut.jpeg" alt="" fill className="object-cover opacity-[0.07]" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(5,13,26,0.97) 0%, rgba(8,26,60,0.93) 50%, rgba(5,13,26,0.97) 100%)' }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.35), transparent)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.25), transparent)' }} />
        </div>

        <div className="relative max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-5">
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-white/70 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60">Informasi</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Galeri</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 reveal reveal-up">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.28)' }}>
                  <Camera className="w-3 h-3" style={{ color: '#38BDF8' }} />
                </div>
                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: '#38BDF8' }}>Dokumentasi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                Galeri Foto & Video
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: '#38BDF8' }} />
                <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
              </div>
            </div>
            <form method="GET" action="/informasi/galeri" className="flex items-center gap-2 w-full sm:w-72">
              {tipeParam && <input type="hidden" name="tipe" value={tipeParam} />}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <input type="text" name="q" defaultValue={queryParam} placeholder="Cari galeri..."
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl outline-none placeholder:text-white/30"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }} />
              </div>
              <button type="submit" className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: '#38BDF8', color: '#050D1A' }}>Cari</button>
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Filter tipe */}
        <div className="flex flex-wrap gap-2 mb-7 reveal reveal-up">
          {[
            { label: 'Semua', value: '', icon: <Images className="w-3 h-3" /> },
            { label: 'Foto',  value: 'FOTO',  icon: <Camera className="w-3 h-3" /> },
            { label: 'Video', value: 'VIDEO', icon: <Film   className="w-3 h-3" /> },
          ].map(({ label, value, icon }) => {
            const active = (tipeParam ?? '') === value
            return (
              <Link key={value} href={buildUrl({ tipe: value, halaman: 1 })}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3.5 py-1.5 rounded-full transition-all hover:scale-105"
                style={{ background: active ? '#38BDF8' : 'rgba(255,255,255,0.06)',
                  color: active ? '#050D1A' : 'rgba(255,255,255,0.55)',
                  border: active ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.10)' }}>
                {icon} {label}
              </Link>
            )
          })}
        </div>

        {/* Info hasil */}
        {(queryParam || tipeParam) && (
          <div className="flex items-center gap-2 mb-5">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Menampilkan <strong className="text-white">{total}</strong> item
              {queryParam && <> untuk <strong className="text-white">&quot;{queryParam}&quot;</strong></>}
              {tipeParam  && <> tipe <strong className="text-white">{tipeParam === 'FOTO' ? 'Foto' : 'Video'}</strong></>}
            </p>
            <Link href="/informasi/galeri" className="text-[11px] font-semibold" style={{ color: '#F87171' }}>Reset</Link>
          </div>
        )}

        {/* Grid galeri */}
        {galeriList.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Images className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.15)' }} />
            <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Tidak ada galeri ditemukan</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.20)' }}>Coba ubah kata kunci atau filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {galeriList.map((g, i) => (
              <Link key={g.id} href={`/informasi/galeri/${g.id}`}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] reveal reveal-scale reveal-delay-${(i % 4) + 1}`}
                style={{ aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.45)', textDecoration: 'none', display: 'block', position: 'relative' }}>
                <Image src={g.thumbnail ?? g.url} alt={g.judul} fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                <div className="absolute inset-0" style={{ background: 'rgba(5,13,26,0.20)' }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                  style={{ background: 'linear-gradient(to top, rgba(5,13,26,0.92), rgba(5,13,26,0.25) 65%, transparent)' }}>
                  <span className="text-white text-xs font-semibold line-clamp-2 leading-snug">{g.judul}</span>
                </div>
                {g.tipe === 'VIDEO' && (
                  <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase"
                    style={{ background: 'rgba(245,166,35,0.90)', color: '#050D1A', backdropFilter: 'blur(4px)' }}>
                    <Film className="w-2.5 h-2.5" /> VIDEO
                  </span>
                )}
                {i === 0 && !tipeParam && !queryParam && halaman === 1 && (
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest uppercase"
                    style={{ background: '#38BDF8', color: '#050D1A' }}>UNGGULAN</span>
                )}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(56,189,248,0.25)' }} />
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalHalaman > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {halaman > 1 && (
              <Link href={buildUrl({ halaman: halaman - 1 })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.20)' }}>
                <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
              </Link>
            )}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalHalaman }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalHalaman || Math.abs(p - halaman) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis')
                  acc.push(p); return acc
                }, [])
                .map((p, i) => p === 'ellipsis'
                  ? <span key={`e-${i}`} className="px-2 text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>…</span>
                  : <Link key={p} href={buildUrl({ halaman: p as number })}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ background: p === halaman ? '#38BDF8' : 'rgba(255,255,255,0.06)',
                        color: p === halaman ? '#050D1A' : 'rgba(255,255,255,0.55)',
                        border: p === halaman ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.08)' }}>
                      {p}
                    </Link>
                )}
            </div>
            {halaman < totalHalaman && (
              <Link href={buildUrl({ halaman: halaman + 1 })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                style={{ background: '#38BDF8', color: '#050D1A', border: '1px solid #38BDF8' }}>
                Berikutnya <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}
        {total > 0 && (
          <p className="text-center text-[11px] mt-4" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Menampilkan {skip + 1}–{Math.min(skip + PER_PAGE, total)} dari {total} item
          </p>
        )}
      </div>
    </main>
  )
}