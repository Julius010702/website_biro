// app/(admin)/admin/page.tsx
import { prisma } from '@/lib/prisma'
import { Newspaper, Images, MessageSquare, AlertTriangle, FileText, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [
    totalBerita, totalGaleri, totalKontak,
    totalPengaduan, totalPermohonan, beritaTerbaru
  ] = await Promise.all([
    prisma.berita.count({ where: { publish: true } }),
    prisma.galeri.count({ where: { aktif: true } }),
    prisma.kontak.count({ where: { dibaca: false } }),
    prisma.pengaduan.count({ where: { status: 'BARU' } }),
    prisma.permohonanInformasi.count({ where: { status: 'PENDING' } }),
    prisma.berita.findMany({
      where: { publish: true }, orderBy: { createdAt: 'desc' }, take: 5,
      select: { id: true, judul: true, kategori: true, views: true, createdAt: true, slug: true },
    }),
  ])

  const stats = [
    { label: 'Berita Terbit',    value: totalBerita,     icon: <Newspaper      className="w-5 h-5" />, href: '/admin/berita',          color: '#0D47A1', bg: '#EFF6FF' },
    { label: 'Galeri Aktif',     value: totalGaleri,     icon: <Images         className="w-5 h-5" />, href: '/admin/galeri',          color: '#0891B2', bg: '#ECFEFF' },
    { label: 'Pesan Belum Dibaca',value: totalKontak,    icon: <MessageSquare  className="w-5 h-5" />, href: '/admin/kontak',          color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Pengaduan Baru',   value: totalPengaduan,  icon: <AlertTriangle  className="w-5 h-5" />, href: '/admin/pengaduan',       color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Permohonan Pending',value: totalPermohonan,icon: <FileText       className="w-5 h-5" />, href: '/admin/ppid/permohonan', color: '#D97706', bg: '#FFFBEB' },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Welcome */}
      <div
        className="rounded-2xl px-6 py-5"
        style={{
          background: 'linear-gradient(135deg, #0A1929 0%, #0D47A1 100%)',
          boxShadow: '0 4px 20px rgba(13,71,161,0.25)',
        }}
      >
        <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Selamat Datang
        </p>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          Panel Admin Biro Organisasi
        </h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.50)' }}>
          Kelola seluruh konten website dari sini.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl p-4 flex flex-col gap-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 2px 10px rgba(13,71,161,0.06)' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: '#94A3B8' }}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent berita */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 2px 10px rgba(13,71,161,0.06)' }}
      >
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
            <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>Berita Terbaru</h3>
          </div>
          <Link href="/admin/berita" className="text-xs font-semibold" style={{ color: '#1565C0' }}>
            Lihat semua →
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {beritaTerbaru.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate" style={{ color: '#0A2342' }}>{b.judul}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>
                  {b.kategori ?? 'Umum'} · {new Date(b.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4 shrink-0" style={{ color: '#94A3B8' }}>
                <Eye className="w-3 h-3" />
                <span className="text-[10px]">{b.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}