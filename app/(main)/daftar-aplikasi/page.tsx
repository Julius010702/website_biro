import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import DaftarAplikasiSlider from './_Slider'

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
    <div className="min-h-screen" style={{ background: '#F4F7FD' }}>
      {/* Header */}
      <div className="px-6 py-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
          style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: '#0D47A1' }}>
            Portal Aplikasi
          </span>
        </div>
        <h1 className="text-3xl font-black mb-2" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
          Daftar Aplikasi
        </h1>
        <p className="text-sm" style={{ color: '#64748B' }}>
          Akses layanan dan sistem informasi digital Biro Organisasi Setda Provinsi NTT
        </p>
      </div>

      {/* Slider */}
      <DaftarAplikasiSlider list={list} />
    </div>
  )
}
