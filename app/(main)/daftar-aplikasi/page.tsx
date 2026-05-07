import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ExternalLink, Monitor } from 'lucide-react'
import NextImage from 'next/image'

export const metadata: Metadata = {
  title: 'Daftar Aplikasi',
  description: 'Daftar aplikasi yang dikelola Biro Organisasi Setda Provinsi NTT',
}

export default async function DaftarAplikasiPage() {
  const list = await prisma.daftarAplikasi.findMany({
    where: { aktif: true },
    orderBy: { urutan: 'asc' },
  })
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>Daftar Aplikasi</h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">Aplikasi yang dikelola dan dikembangkan oleh Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur.</p>
      </div>
      {list.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
          <Monitor className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-sm text-slate-400">Belum ada aplikasi tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map(function(app) {
            return (
              <a key={app.id} href={app.href} target="_blank" rel="noopener noreferrer"
                className="rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ background: 'white', border: '1px solid #DBEAFE' }}>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#EFF6FF' }}>
                    {app.logo
                      ? <NextImage src={app.logo} alt={app.nama} width={32} height={32} className="object-contain" />
                      : <Monitor className="w-6 h-6" style={{ color: '#0D47A1' }} />}
                  </div>
                  {app.kategori && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#EFF6FF', color: '#0D47A1' }}>{app.kategori}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-base font-bold mb-1" style={{ color: '#0A2342' }}>{app.nama}</h2>
                  {app.deskripsi && <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{app.deskripsi}</p>}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{ color: '#0D47A1' }}>
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Aplikasi
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
