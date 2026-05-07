import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ExternalLink, Monitor, LayoutGrid } from 'lucide-react'
import NextImage from 'next/image'

export const metadata: Metadata = {
  title: 'Daftar Aplikasi',
  description: 'Daftar aplikasi yang dikelola Biro Organisasi Setda Provinsi NTT',
}

const gradients = [
  'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
  'linear-gradient(135deg, #065F46 0%, #047857 100%)',
  'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
  'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
  'linear-gradient(135deg, #BE185D 0%, #DB2777 100%)',
  'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)',
]

export default async function DaftarAplikasiPage() {
  const list = await prisma.daftarAplikasi.findMany({
    where: { aktif: true },
    orderBy: { urutan: 'asc' },
  })

  return (
    <div className="min-h-screen" style={{ background: '#F4F7FD' }}>
      {/* Hero Header */}
      <div
        className="relative overflow-hidden px-6 py-14 text-center"
        style={{
          background: 'linear-gradient(135deg, #06101E 0%, #0A2342 60%, #0D47A1 100%)',
        }}
      >
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)' }}>
            <LayoutGrid className="w-3.5 h-3.5" style={{ color: '#F5A623' }} />
            <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: '#F5A623' }}>
              Portal Aplikasi
            </span>
          </div>
          <h1 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            Daftar Aplikasi
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Akses layanan dan sistem informasi digital Biro Organisasi<br />Sekretariat Daerah Provinsi Nusa Tenggara Timur
          </p>
          {list.length > 0 && (
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {list.length} Aplikasi Tersedia
              </span>
            </div>
          )}
        </div>
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8"
          style={{ background: 'linear-gradient(to bottom, transparent, #F4F7FD)' }} />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {list.length === 0 ? (
          <div className="rounded-2xl p-16 text-center"
            style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 2px 12px rgba(13,71,161,0.06)' }}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: '#EFF6FF' }}>
              <Monitor className="w-8 h-8" style={{ color: '#BFDBFE' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#94A3B8' }}>Belum ada aplikasi tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map(function(app, i) {
              const grad = gradients[i % gradients.length]
              return (
                <a
                  key={app.id}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    background: 'white',
                    border: '1px solid #E2EAF6',
                    boxShadow: '0 2px 16px rgba(13,71,161,0.06)',
                    textDecoration: 'none',
                  }}
                >
                  {/* Top banner */}
                  <div className="relative h-28 flex items-center justify-center overflow-hidden"
                    style={{ background: grad }}>
                    {/* Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }} />
                    {app.logo ? (
                      <div className="relative z-10 w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                        <NextImage src={app.logo} alt={app.nama} width={48} height={48} className="object-contain p-1" />
                      </div>
                    ) : (
                      <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                        <Monitor className="w-8 h-8 text-white" />
                      </div>
                    )}
                    {/* Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'rgba(255,255,255,0.08)' }} />
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-3 p-5 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-sm font-black leading-tight" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
                        {app.nama}
                      </h2>
                      {app.kategori && (
                        <span className="shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase"
                          style={{ background: '#EFF6FF', color: '#0D47A1', border: '1px solid #DBEAFE' }}>
                          {app.kategori}
                        </span>
                      )}
                    </div>
                    {app.deskripsi && (
                      <p className="text-xs leading-relaxed flex-1" style={{ color: '#64748B' }}>
                        {app.deskripsi}
                      </p>
                    )}
                    {/* CTA */}
                    <div className="flex items-center justify-between pt-3 mt-auto"
                      style={{ borderTop: '1px solid #F0F4FF' }}>
                      <span className="text-xs font-bold flex items-center gap-1.5 transition-all group-hover:gap-2.5"
                        style={{ color: '#0D47A1' }}>
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buka Aplikasi
                      </span>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                        style={{ background: '#EFF6FF' }}>
                        <ExternalLink className="w-3.5 h-3.5" style={{ color: '#0D47A1' }} />
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}