// app/(main)/ppid/serta-merta/page.tsx
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Image from 'next/image'
import { FileText, Download, Share2, ExternalLink, ImageIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Informasi Serta Merta | PPID Biro Organisasi NTT',
  description: 'Informasi yang wajib diumumkan secara serta merta oleh PPID Biro Organisasi Setda Provinsi NTT',
}

export default async function SertaMertaPage() {
  const list = await prisma.informasiSertaMerta.findMany({
    where: { aktif: true },
    orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
  })

  const sosmedLinks = [
    { label: 'Facebook', icon: '📘', color: '#1877F2', url: 'https://www.facebook.com/sharer/sharer.php?u=' },
    { label: 'Twitter/X', icon: '🐦', color: '#000000', url: 'https://twitter.com/intent/tweet?url=' },
    { label: 'WhatsApp', icon: '💬', color: '#25D366', url: 'https://wa.me/?text=' },
    { label: 'Telegram', icon: '✈️', color: '#0088CC', url: 'https://t.me/share/url?url=' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Informasi Serta Merta
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Informasi yang wajib diumumkan secara serta merta oleh PPID Biro Organisasi Setda Provinsi NTT.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
          <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#BFDBFE' }} />
          <p className="text-sm font-semibold" style={{ color: '#94A3B8' }}>Belum ada informasi serta merta.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((item, idx) => (
            <div key={item.id} className="rounded-2xl overflow-hidden"
              style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 2px 12px rgba(13,71,161,0.06)' }}>
              {/* Card Header */}
              <div className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: '1px solid #EFF6FF', background: '#F8FAFF' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0D47A1, #1565C0)', color: 'white' }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h2 className="text-sm font-bold flex-1" style={{ color: '#0A2342' }}>{item.judul}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: '#EFF6FF', color: '#0D47A1' }}>
                  {item.tipe}
                </span>
              </div>

              <div className="p-6 flex flex-col gap-4">
                {/* Deskripsi */}
                {item.deskripsi && (
                  <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>{item.deskripsi}</p>
                )}

                {/* Gambar */}
                {item.gambar && (
                  <div className="relative w-full rounded-xl overflow-hidden"
                    style={{ minHeight: 200, border: '1px solid #E5E7EB' }}>
                    <Image src={item.gambar} alt={item.judul} fill
                      className="object-contain p-2 bg-slate-50" sizes="(max-width: 1024px) 100vw, 75vw" />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: '1px solid #F0F4FF' }}>
                  {/* Unduh */}
                  {item.file && (
                    <a href={item.file} target="_blank" rel="noopener noreferrer" download
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 hover:shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #0D47A1, #1565C0)', color: 'white' }}>
                      <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                    </a>
                  )}
                  {item.gambar && (
                    <a href={item.gambar} target="_blank" rel="noopener noreferrer" download
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                      style={{ background: '#EFF6FF', color: '#0D47A1', border: '1px solid #DBEAFE' }}>
                      <ImageIcon className="w-3.5 h-3.5" /> Unduh Gambar
                    </a>
                  )}

                  {/* Share section */}
                  <div className="flex items-center gap-2 ml-auto flex-wrap">
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#94A3B8' }}>
                      <Share2 className="w-3 h-3" /> Bagikan:
                    </span>
                    {sosmedLinks.map((s) => {
                      const shareUrl = item.urlSosmed
                        ? s.url + encodeURIComponent(item.urlSosmed)
                        : item.file
                          ? s.url + encodeURIComponent(item.file)
                          : null
                      return shareUrl ? (
                        <a key={s.label} href={shareUrl} target="_blank" rel="noopener noreferrer"
                          title={`Bagikan ke ${s.label}`}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110 hover:shadow-md"
                          style={{ background: s.color, color: 'white' }}>
                          {s.icon}
                        </a>
                      ) : null
                    })}
                    {item.urlSosmed && (
                      <a href={item.urlSosmed} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                        style={{ background: '#F8FAFF', color: '#0D47A1', border: '1px solid #DBEAFE' }}>
                        <ExternalLink className="w-3 h-3" /> Lihat Sumber
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
