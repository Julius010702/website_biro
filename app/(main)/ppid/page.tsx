// app/(public)/ppid/page.tsx
import { prisma }        from '@/lib/prisma'
import type { Metadata } from 'next'
import { Shield, FileText, Users, MessageSquare, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Seputar PPID',
  description: 'Pejabat Pengelola Informasi dan Dokumentasi Biro Organisasi Setda Provinsi NTT',
}

export default async function PPIDPage() {
  const [totalDokumen, totalPermohonan, maklumat] = await Promise.all([
    prisma.dokumenPPID.count({ where: { aktif: true } }),
    prisma.permohonanInformasi.count(),
    prisma.maklumatPelayanan.findFirst({ where: { aktif: true } }),
  ])

  const infoCards = [
    {
      icon: <Shield        className="w-6 h-6" />,
      label: 'Dasar Hukum',
      nilai: 'UU 14/2008',
      sub: 'Keterbukaan Informasi Publik',
      color: '#0D47A1', bg: '#EFF6FF',
    },
    {
      icon: <FileText      className="w-6 h-6" />,
      label: 'Total Dokumen',
      nilai: String(totalDokumen),
      sub: 'Dokumen tersedia',
      color: '#065F46', bg: '#ECFDF5',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      label: 'Permohonan',
      nilai: String(totalPermohonan),
      sub: 'Permohonan masuk',
      color: '#7C3AED', bg: '#F5F3FF',
    },
    {
      icon: <Users         className="w-6 h-6" />,
      label: 'Atasan PPID',
      nilai: 'Kepala Biro',
      sub: 'Biro Organisasi Setda NTT',
      color: '#B45309', bg: '#FFFBEB',
    },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* ── Hero card ── */}
      <div
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2342 0%, #0D47A1 60%, #1565C0 100%)' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ppid-dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ppid-dot)" />
        </svg>
        <div className="relative">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.35)', color: '#FCD34D' }}
          >
            <Shield className="w-3 h-3" /> Pejabat Pengelola Informasi & Dokumentasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            PPID Biro Organisasi
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Pejabat Pengelola Informasi dan Dokumentasi (PPID) Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur berkomitmen memberikan pelayanan informasi publik yang transparan, akuntabel, dan mudah diakses oleh seluruh masyarakat.
          </p>
          <div className="flex items-center gap-1.5 mt-5">
            <div className="w-10 h-0.75 rounded-full bg-white/80" />
            <div className="w-4 h-0.75 rounded-full bg-yellow-400" />
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {infoCards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl p-4"
            style={{ background: c.bg, border: `1px solid ${c.color}18` }}
          >
            <div className="mb-2" style={{ color: c.color }}>{c.icon}</div>
            <div className="text-xl font-bold mb-0.5" style={{ color: c.color, fontFamily: 'var(--font-heading)' }}>{c.nilai}</div>
            <div className="text-[10px] font-bold" style={{ color: c.color }}>{c.label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: `${c.color}99` }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tentang PPID ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Tentang PPID</h2>
        </div>
        <div className="text-sm text-slate-600 leading-relaxed space-y-3">
          <p>
            PPID (Pejabat Pengelola Informasi dan Dokumentasi) merupakan pejabat yang bertanggung jawab di bidang penyimpanan, pendokumentasian, penyediaan, dan/atau pelayanan informasi di badan publik sesuai amanat <strong>Undang-Undang Nomor 14 Tahun 2008</strong> tentang Keterbukaan Informasi Publik.
          </p>
          <p>
            Biro Organisasi Setda Provinsi NTT sebagai badan publik wajib menyediakan, memberikan, dan/atau menerbitkan informasi publik yang berada di bawah kewenangannya kepada pemohon informasi publik, selain informasi yang dikecualikan sesuai ketentuan peraturan perundang-undangan.
          </p>
          <p>
            Pelayanan informasi publik dilaksanakan pada hari dan jam kerja: <strong>Senin–Jumat, pukul 08.00–16.00 WITA</strong>.
          </p>
        </div>
      </div>

      {/* ── Maklumat singkat ── */}
      {maklumat && (
        <div
          className="rounded-2xl p-5 flex items-start gap-4"
          style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}
        >
          <Shield className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-yellow-800 mb-1">Maklumat Pelayanan</p>
            <p
              className="text-xs text-yellow-700 leading-relaxed line-clamp-3"
              dangerouslySetInnerHTML={{ __html: maklumat.konten.substring(0, 300) + '...' }}
            />
            <Link
              href="/ppid/maklumat"
              className="text-[11px] font-bold text-yellow-700 mt-2 inline-flex items-center gap-1 hover:text-yellow-900"
            >
              Baca Selengkapnya <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}