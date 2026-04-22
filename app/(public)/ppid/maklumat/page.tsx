// app/(public)/ppid/maklumat/page.tsx
import { prisma }        from '@/lib/prisma'
import Image             from 'next/image'
import type { Metadata } from 'next'
import { Heart, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maklumat Pelayanan',
  description: 'Maklumat Pelayanan Informasi PPID Biro Organisasi Setda Provinsi NTT',
}

export default async function MaklumatPelayananPage() {
  const maklumat = await prisma.maklumatPelayanan.findFirst({
    where: { aktif: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Maklumat Pelayanan
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Komitmen Biro Organisasi Setda Provinsi NTT dalam memberikan pelayanan informasi publik.
        </p>
      </div>

      {maklumat ? (
        <>
          {/* ── Gambar maklumat ── */}
          {maklumat.gambar && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'white', border: '1px solid #DBEAFE' }}
            >
              <div className="relative w-full" style={{ minHeight: '280px' }}>
                <Image
                  src={maklumat.gambar}
                  alt="Maklumat Pelayanan"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                />
              </div>
            </div>
          )}

          {/* ── Konten maklumat ── */}
          <div
            className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0A2342, #0D47A1)', border: '1px solid #0D47A1' }}
          >
            {/* Dekorasi */}
            <div className="absolute top-4 right-4 opacity-10">
              <Shield className="w-24 h-24 text-white" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.3)' }}
                >
                  <Heart className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Maklumat</p>
                  <p className="text-sm font-bold text-white">Pelayanan Informasi Publik</p>
                </div>
              </div>

              <div
                className="prose prose-sm max-w-none text-white/80 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.8)' }}
                dangerouslySetInnerHTML={{ __html: maklumat.konten }}
              />

              <div className="flex items-center gap-1.5 mt-6">
                <div className="w-10 h-0.75 rounded-full bg-white/60" />
                <div className="w-4 h-0.75 rounded-full bg-yellow-400" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'white', border: '1px solid #DBEAFE' }}
        >
          <Heart className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-sm text-slate-400">Maklumat pelayanan belum tersedia.</p>
        </div>
      )}

      {/* ── Standar pelayanan ── */}
      <StandarPelayananSection />
    </div>
  )
}

async function StandarPelayananSection() {
  const standarList = await prisma.standarPelayanan.findMany({
    where:   { aktif: true },
    orderBy: { urutan: 'asc' },
  })

  if (!standarList.length) return null

  return (
    <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-5 rounded-full bg-blue-700" />
        <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Standar Pelayanan</h2>
      </div>
      <div className="flex flex-col gap-4">
        {standarList.map((s, i) => (
          <div key={s.id} className="flex items-start gap-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: '#EFF6FF', color: '#0D47A1' }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800 mb-1">{s.judul}</p>
              {s.deskripsi && (
                <p className="text-xs text-slate-500 leading-relaxed">{s.deskripsi}</p>
              )}
              {s.file && (
                <a
                  href={s.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold mt-2 text-blue-700 hover:text-blue-900"
                >
                  Unduh Dokumen →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}