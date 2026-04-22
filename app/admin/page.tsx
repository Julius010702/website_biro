// app/admin/page.tsx
import { prisma }    from '@/lib/prisma'
import Link          from 'next/link'
import { format }    from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import type { Metadata } from 'next'
import {
  Newspaper, Images, MessageSquare, AlertTriangle,
  FileText, Eye, Clock, ChevronRight,
  Users, BarChart3,
} from 'lucide-react'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const [
    totalBerita,
    totalBeritaDraft,
    totalGaleri,
    totalKontak,
    totalPengaduan,
    totalPermohonan,
    totalBagian,
    beritaTerbaru,
    permohonanTerbaru,
    pengaduanTerbaru,
  ] = await Promise.all([
    prisma.berita.count({ where: { publish: true } }),
    prisma.berita.count({ where: { publish: false } }),
    prisma.galeri.count({ where: { aktif: true } }),
    prisma.kontak.count({ where: { dibaca: false } }),
    prisma.pengaduan.count({ where: { status: 'BARU' } }),
    prisma.permohonanInformasi.count({ where: { status: 'PENDING' } }),
    prisma.bagian.count(),
    prisma.berita.findMany({
      where:   { publish: true },
      orderBy: { createdAt: 'desc' },
      take:    5,
      select:  { id: true, judul: true, kategori: true, views: true, createdAt: true, slug: true },
    }),
    prisma.permohonanInformasi.findMany({
      orderBy: { createdAt: 'desc' },
      take:    3,
      select:  { id: true, namaPemohon: true, nomorRegister: true, status: true, createdAt: true },
    }),
    prisma.pengaduan.findMany({
      where:   { status: 'BARU' },
      orderBy: { createdAt: 'desc' },
      take:    3,
      select:  { id: true, subjek: true, nomorTiket: true, unitKerja: true, createdAt: true },
    }),
  ])

  // ── Stat cards ──────────────────────────────────────────────────────────────
  const stats = [
    {
      label:  'Berita Terbit',
      value:  totalBerita,
      sub:    `${totalBeritaDraft} draft`,
      icon:   <Newspaper      className="w-5 h-5" />,
      href:   '/admin/berita',
      color:  '#0D47A1',
      bg:     '#EFF6FF',
    },
    {
      label:  'Galeri Aktif',
      value:  totalGaleri,
      sub:    'foto & video',
      icon:   <Images         className="w-5 h-5" />,
      href:   '/admin/galeri',
      color:  '#0891B2',
      bg:     '#ECFEFF',
    },
    {
      label:  'Pesan Belum Dibaca',
      value:  totalKontak,
      sub:    'perlu ditindaklanjuti',
      icon:   <MessageSquare  className="w-5 h-5" />,
      href:   '/admin/kontak',
      color:  '#7C3AED',
      bg:     '#F5F3FF',
    },
    {
      label:  'Pengaduan Baru',
      value:  totalPengaduan,
      sub:    'belum diproses',
      icon:   <AlertTriangle  className="w-5 h-5" />,
      href:   '/admin/pengaduan',
      color:  '#DC2626',
      bg:     '#FEF2F2',
    },
    {
      label:  'Permohonan Pending',
      value:  totalPermohonan,
      sub:    'menunggu verifikasi',
      icon:   <FileText       className="w-5 h-5" />,
      href:   '/admin/ppid/permohonan',
      color:  '#D97706',
      bg:     '#FFFBEB',
    },
    {
      label:  'Unit Kerja (Bagian)',
      value:  totalBagian,
      sub:    'bagian aktif',
      icon:   <Users          className="w-5 h-5" />,
      href:   '/admin/profil/bagian',
      color:  '#065F46',
      bg:     '#ECFDF5',
    },
  ]

  // ── Status badge helper ──────────────────────────────────────────────────────
  function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      PENDING:     { label: 'Pending',     color: '#D97706', bg: '#FFFBEB' },
      DIPROSES:    { label: 'Diproses',    color: '#0D47A1', bg: '#EFF6FF' },
      SELESAI:     { label: 'Selesai',     color: '#065F46', bg: '#ECFDF5' },
      DITOLAK:     { label: 'Ditolak',     color: '#DC2626', bg: '#FEF2F2' },
      BARU:        { label: 'Baru',        color: '#DC2626', bg: '#FEF2F2' },
      DIVERIFIKASI:{ label: 'Diverifikasi',color: '#7C3AED', bg: '#F5F3FF' },
      DITUTUP:     { label: 'Ditutup',     color: '#64748B', bg: '#F1F5F9' },
    }
    const s = map[status] ?? { label: status, color: '#64748B', bg: '#F1F5F9' }
    return (
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: s.bg, color: s.color }}
      >
        {s.label}
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Welcome banner ── */}
      <div
        className="rounded-2xl px-6 py-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1929 0%, #0D47A1 100%)', boxShadow: '0 4px 20px rgba(13,71,161,0.25)' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="adm-dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#adm-dot)" />
        </svg>
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Selamat Datang
            </p>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Panel Admin Biro Organisasi
            </h2>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Kelola seluruh konten website dari sini. Data diperbarui secara realtime.
            </p>
          </div>
          <BarChart3 className="w-10 h-10 shrink-0 opacity-20 text-white" />
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl p-4 flex flex-col gap-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background:   'white',
              border:       '1px solid #E2EAF6',
              boxShadow:    '0 2px 10px rgba(13,71,161,0.06)',
              textDecoration: 'none',
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: s.bg, color: s.color }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-semibold mt-1 leading-tight" style={{ color: '#0A2342' }}>{s.label}</p>
              <p className="text-[9px] mt-0.5" style={{ color: '#94A3B8' }}>{s.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Tabel bawah: 3 kolom ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Berita terbaru */}
        <div
          className="lg:col-span-1 rounded-2xl overflow-hidden"
          style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 2px 10px rgba(13,71,161,0.06)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-blue-700" />
              <h3 className="text-xs font-bold" style={{ color: '#0A2342' }}>Berita Terbaru</h3>
            </div>
            <Link href="/admin/berita" className="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5">
              Semua <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {beritaTerbaru.length === 0 ? (
              <p className="px-4 py-8 text-xs text-center text-slate-300">Belum ada berita.</p>
            ) : beritaTerbaru.map((b) => (
              <Link
                key={b.id}
                href={`/admin/berita/${b.id}`}
                className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                style={{ textDecoration: 'none' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold line-clamp-2 leading-snug" style={{ color: '#0A2342' }}>
                    {b.judul}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {b.kategori && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: '#EFF6FF', color: '#1565C0' }}
                      >
                        {b.kategori}
                      </span>
                    )}
                    <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {format(new Date(b.createdAt), 'd MMM', { locale: localeId })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 mt-0.5" style={{ color: '#94A3B8' }}>
                  <Eye className="w-3 h-3" />
                  <span className="text-[10px]">{b.views}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Permohonan terbaru */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 2px 10px rgba(13,71,161,0.06)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#D97706' }} />
              <h3 className="text-xs font-bold" style={{ color: '#0A2342' }}>Permohonan Informasi</h3>
            </div>
            <Link href="/admin/ppid/permohonan" className="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5">
              Semua <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {permohonanTerbaru.length === 0 ? (
              <p className="px-4 py-8 text-xs text-center text-slate-300">Tidak ada permohonan.</p>
            ) : permohonanTerbaru.map((p) => (
              <Link
                key={p.id}
                href={`/admin/ppid/permohonan/${p.id}`}
                className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                style={{ textDecoration: 'none' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold truncate" style={{ color: '#0A2342' }}>
                    {p.namaPemohon}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-mono">{p.nomorRegister}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {format(new Date(p.createdAt), 'd MMM yyyy', { locale: localeId })}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
          {totalPermohonan > 3 && (
            <div className="px-4 py-2.5" style={{ borderTop: '1px solid #EEF3FC' }}>
              <Link
                href="/admin/ppid/permohonan"
                className="block text-center text-[11px] font-semibold py-2 rounded-xl transition-all hover:bg-blue-50"
                style={{ color: '#0D47A1' }}
              >
                +{totalPermohonan - 3} permohonan lainnya
              </Link>
            </div>
          )}
        </div>

        {/* Pengaduan terbaru */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 2px 10px rgba(13,71,161,0.06)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-red-600" />
              <h3 className="text-xs font-bold" style={{ color: '#0A2342' }}>Pengaduan (WBS)</h3>
            </div>
            <Link href="/admin/pengaduan" className="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5">
              Semua <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {pengaduanTerbaru.length === 0 ? (
              <p className="px-4 py-8 text-xs text-center text-slate-300">Tidak ada pengaduan baru.</p>
            ) : pengaduanTerbaru.map((p) => (
              <Link
                key={p.id}
                href={`/admin/pengaduan/${p.id}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#FEF2F2' }}
                >
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold line-clamp-1" style={{ color: '#0A2342' }}>
                    {p.subjek}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{p.unitKerja}</p>
                  <p className="text-[9px] font-mono text-slate-300 mt-0.5">{p.nomorTiket}</p>
                </div>
              </Link>
            ))}
          </div>
          {totalPengaduan > 3 && (
            <div className="px-4 py-2.5" style={{ borderTop: '1px solid #EEF3FC' }}>
              <Link
                href="/admin/pengaduan"
                className="block text-center text-[11px] font-semibold py-2 rounded-xl transition-all hover:bg-red-50"
                style={{ color: '#DC2626' }}
              >
                +{totalPengaduan - 3} pengaduan lainnya
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #E2EAF6' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 rounded-full bg-blue-700" />
          <h3 className="text-xs font-bold" style={{ color: '#0A2342' }}>Aksi Cepat</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '+ Tambah Berita',    href: '/admin/berita/tambah',        color: '#0D47A1', bg: '#EFF6FF' },
            { label: '+ Upload Galeri',    href: '/admin/galeri/tambah',        color: '#0891B2', bg: '#ECFEFF' },
            { label: '+ Tambah Regulasi',  href: '/admin/regulasi/tambah',      color: '#7C3AED', bg: '#F5F3FF' },
            { label: '+ Dokumen PPID',     href: '/admin/ppid/dokumen/tambah',  color: '#065F46', bg: '#ECFDF5' },
            { label: 'Pengaturan Situs',   href: '/admin/pengaturan',           color: '#64748B', bg: '#F1F5F9' },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
              style={{ background: a.bg, color: a.color, border: `1px solid ${a.color}20` }}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}