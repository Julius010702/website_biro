// app/(main)/ppid/informasi-publik/page.tsx
import { prisma }        from '@/lib/prisma'
import Image             from 'next/image'
import type { Metadata } from 'next'
import { FileText, Download, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Informasi Publik',
  description: 'Informasi Publik PPID Biro Organisasi Setda Provinsi NTT',
}

export default async function InformasiPublikPage() {
  // Jalankan: npx prisma migrate dev --name add_informasi_publik
  const itemList = await prisma.informasiPublik.findMany({
    where:   { aktif: true },
    orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
  })

  // Kelompokkan berdasarkan kategori
  const grouped = itemList.reduce<Record<string, typeof itemList>>((acc, item) => {
    const key = item.kategori || 'Umum'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Informasi Publik
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Pelayanan informasi publik PPID Biro Organisasi Setda Provinsi Nusa Tenggara Timur.
        </p>
      </div>

      {itemList.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
          <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-sm text-slate-400">Informasi publik belum tersedia.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([kategori, items]) => (
          <div key={kategori} className="flex flex-col gap-4">

            {/* Label kategori */}
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-blue-700" />
              <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>{kategori}</h2>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'white', border: '1px solid #DBEAFE' }}
              >
                {/* Judul item */}
                <div className="px-5 py-4 border-b" style={{ borderColor: '#EFF6FF' }}>
                  <h3 className="text-sm font-semibold" style={{ color: '#0A2342' }}>{item.judul}</h3>
                  {item.deskripsi && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.deskripsi}</p>
                  )}
                </div>

                {/* Gambar */}
                {item.tipe === 'GAMBAR' && item.url && (
                  <div className="relative w-full" style={{ minHeight: '260px' }}>
                    <Image
                      src={item.url}
                      alt={item.judul}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 1024px) 100vw, 75vw"
                    />
                  </div>
                )}

                {/* Dokumen */}
                {item.tipe === 'DOKUMEN' && item.url && (
                  <div className="px-5 py-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
                    >
                      <Download className="w-4 h-4" />
                      Unduh / Lihat Dokumen
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  </div>
                )}

                {/* Gambar + Dokumen */}
                {item.tipe === 'GAMBAR_DOKUMEN' && (
                  <>
                    {item.url && (
                      <div className="relative w-full" style={{ minHeight: '260px' }}>
                        <Image
                          src={item.url}
                          alt={item.judul}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 1024px) 100vw, 75vw"
                        />
                      </div>
                    )}
                    {item.urlDokumen && (
                      <div className="px-5 py-4 border-t" style={{ borderColor: '#EFF6FF' }}>
                        <a
                          href={item.urlDokumen}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                          style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
                        >
                          <Download className="w-4 h-4" />
                          Unduh Dokumen
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}