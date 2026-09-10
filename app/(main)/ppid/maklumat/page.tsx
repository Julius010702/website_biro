// app/(public)/ppid/maklumat/page.tsx
import { prisma }        from '@/lib/prisma'
import ZoomableImage     from '@/components/common/ZoomableImage'
import Image             from 'next/image'
import type { Metadata } from 'next'
import { Heart } from 'lucide-react'

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

      {maklumat ? (
        <>
          {/* -- Hero card Maklumat -- */}
          <div
            className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0A2342 0%, #0D47A1 60%, #1565C0 100%)' }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="maklumat-dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#maklumat-dot)" />
            </svg>

            <div className="relative max-w-2xl">
              <span
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.35)', color: '#FCD34D' }}
              >
                <Heart className="w-3 h-3" /> Maklumat
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Pelayanan Informasi Publik
              </h1>
              <div
                className="prose prose-sm max-w-none text-white/60 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                dangerouslySetInnerHTML={{ __html: maklumat.konten }}
              />
              <div className="flex items-center gap-1.5 mt-5">
                <div className="w-10 h-0.75 rounded-full bg-white/80" />
                <div className="w-4 h-0.75 rounded-full bg-yellow-400" />
              </div>
            </div>

            {/* -- Logo dekoratif gembok -- */}
            <Image
              src="/images/logo-buka-informasi-publik.png"
              alt="Buka Informasi Publik"
              width={280}
              height={280}
              className="hidden lg:block absolute pointer-events-none select-none"
              style={{ right: '2rem', top: '50%', transform: 'translateY(-50%)', width: '150px', height: 'auto', opacity: 0.95 }}
            />
          </div>

          {/* -- Header putih -- */}
          <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 rounded-full bg-blue-700" />
              <h2 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
                Maklumat Pelayanan
              </h2>
            </div>
            <p className="text-xs text-slate-500 ml-3">
              {maklumat.deskripsi}
            </p>
          </div>

          {/* -- Gambar maklumat -- */}
          {maklumat.gambar && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'white', border: '1px solid #DBEAFE' }}
            >
              <div className="relative w-full" style={{ minHeight: '280px' }}>
                <ZoomableImage
                  src={maklumat.gambar}
                  alt="Maklumat Pelayanan"
                  width={800} height={800}
                  className="w-auto h-auto max-w-full rounded-lg"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                />
              </div>
            </div>
          )}
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

    </div>
  )
}