// app/(public)/ppid/pelayanan/page.tsx
import { prisma }        from '@/lib/prisma'
import type { Metadata } from 'next'
import Link              from 'next/link'
import {
  FileText, Clock, CheckCircle, AlertCircle,
  Download, MessageSquare, BookOpen, Lock,
  ArrowRight, Phone, Mail, MapPin,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pelayanan Informasi',
  description: 'Pelayanan Informasi Publik PPID Biro Organisasi Setda Provinsi NTT',
}

const jenisLayanan = [
  {
    icon: <BookOpen      className="w-5 h-5" />,
    judul: 'Informasi Berkala',
    deskripsi: 'Informasi yang wajib disediakan dan diumumkan secara berkala oleh badan publik, minimal 6 bulan sekali.',
    href: '/ppid/daftar-informasi?kategori=DAFTAR_INFORMASI',
    color: '#0D47A1', bg: '#EFF6FF',
  },
  {
    icon: <Clock         className="w-5 h-5" />,
    judul: 'Informasi Serta Merta',
    deskripsi: 'Informasi yang harus diumumkan segera karena dapat mengancam hajat hidup orang banyak.',
    href: '/ppid/daftar-informasi',
    color: '#C2410C', bg: '#FFF7ED',
  },
  {
    icon: <FileText      className="w-5 h-5" />,
    judul: 'Informasi Setiap Saat',
    deskripsi: 'Informasi yang tersedia setiap saat dan dapat diakses oleh masyarakat tanpa permohonan khusus.',
    href: '/ppid/daftar-informasi',
    color: '#065F46', bg: '#ECFDF5',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    judul: 'Informasi atas Permohonan',
    deskripsi: 'Informasi yang diberikan atas dasar permintaan tertulis dari pemohon informasi publik.',
    href: '/ppid/permohonan',
    color: '#7C3AED', bg: '#F5F3FF',
  },
]

const alurLayanan = [
  { step: '01', judul: 'Pemohon Mengajukan',    deskripsi: 'Pemohon mengisi formulir permohonan secara online atau datang langsung ke kantor.' },
  { step: '02', judul: 'PPID Menerima',          deskripsi: 'PPID mencatat permohonan dan memberikan nomor register kepada pemohon.' },
  { step: '03', judul: 'Verifikasi & Proses',    deskripsi: 'PPID memverifikasi dan memproses permohonan dalam waktu maksimal 10 hari kerja.' },
  { step: '04', judul: 'Pemberitahuan',           deskripsi: 'PPID memberitahukan apakah informasi tersedia, dikecualikan, atau tidak dikuasai.' },
  { step: '05', judul: 'Penyampaian Informasi',   deskripsi: 'Informasi disampaikan sesuai cara yang dipilih pemohon (email, langsung, atau pos).' },
]

const hakKewajiban = {
  hak: [
    'Melihat dan mengetahui informasi publik',
    'Menghadiri pertemuan publik yang terbuka untuk umum',
    'Mendapatkan salinan informasi publik',
    'Menyebarluaskan informasi publik',
    'Mengajukan permintaan informasi disertai alasan permintaan',
    'Mengajukan gugatan ke pengadilan apabila ada hambatan',
  ],
  kewajiban: [
    'Menggunakan informasi publik sesuai ketentuan peraturan perundang-undangan',
    'Mencantumkan sumber informasi publik yang diperoleh dengan benar',
    'Menjaga kerahasiaan informasi yang dikecualikan',
    'Tidak menggunakan informasi publik untuk hal yang melanggar hukum',
  ],
}

export default async function PelayananInformasiPage() {
  const [standarPelayanan, maklumat] = await Promise.all([
    prisma.standarPelayanan.findMany({
      where:   { aktif: true },
      orderBy: { urutan: 'asc' },
    }),
    prisma.maklumatPelayanan.findFirst({ where: { aktif: true } }),
  ])

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Pelayanan Informasi Publik
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3 leading-relaxed">
          Layanan informasi publik PPID Biro Organisasi Setda Provinsi NTT sesuai UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.
        </p>
      </div>

      {/* ── Jenis Layanan ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Jenis Layanan Informasi</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {jenisLayanan.map((l) => (
            <Link
              key={l.judul}
              href={l.href}
              className="group flex flex-col gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: l.bg, border: `1px solid ${l.color}18`, textDecoration: 'none' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${l.color}15`, color: l.color }}
                >
                  {l.icon}
                </div>
                <span className="text-sm font-bold leading-snug" style={{ color: l.color }}>{l.judul}</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: `${l.color}99` }}>{l.deskripsi}</p>
              <div className="flex items-center gap-1 text-[11px] font-semibold mt-auto" style={{ color: l.color }}>
                Lihat Dokumen <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Alur Pelayanan ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Alur Pelayanan Informasi</h2>
        </div>
        <div className="flex flex-col gap-0">
          {alurLayanan.map((a, i) => (
            <div key={i} className="flex gap-4">
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                  style={{ background: '#0D47A1', color: 'white' }}
                >
                  {a.step}
                </div>
                {i < alurLayanan.length - 1 && (
                  <div className="w-px flex-1 my-1" style={{ background: '#DBEAFE', minHeight: '24px' }} />
                )}
              </div>
              {/* Content */}
              <div className="pb-5 flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 mb-0.5">{a.judul}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{a.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Standar Pelayanan dari DB ── */}
      {standarPelayanan.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#EFF6FF', borderBottom: '1px solid #DBEAFE' }}>
            <CheckCircle className="w-4 h-4 text-blue-700" />
            <h2 className="text-xs font-bold text-blue-700">Standar Pelayanan</h2>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-700 text-white">
              {standarPelayanan.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {standarPelayanan.map((s) => (
              <div key={s.id} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{s.judul}</p>
                  {s.deskripsi && (
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{s.deskripsi}</p>
                  )}
                </div>
                {s.file && (
                  <a
                    href={s.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:scale-105 transition-all"
                    style={{ background: '#EFF6FF', color: '#0D47A1', border: '1px solid #DBEAFE' }}
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Hak & Kewajiban ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Hak */}
        <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-600" />
            <h2 className="text-sm font-bold" style={{ color: '#0A2342' }}>Hak Pemohon Informasi</h2>
          </div>
          <div className="flex flex-col gap-2">
            {hakKewajiban.hak.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">{h}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kewajiban */}
        <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-orange-500" />
            <h2 className="text-sm font-bold" style={{ color: '#0A2342' }}>Kewajiban Pemohon</h2>
          </div>
          <div className="flex flex-col gap-2">
            {hakKewajiban.kewajiban.map((k, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <AlertCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Informasi Dikecualikan ── */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}
      >
        <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-bold text-blue-800 mb-1">Informasi yang Dikecualikan</p>
          <p className="text-xs text-blue-700 leading-relaxed mb-3">
            Tidak semua informasi dapat diberikan. Informasi yang dikecualikan meliputi informasi yang dapat membahayakan keamanan negara, menghambat penegakan hukum, dan hal lain sesuai Pasal 17 UU KIP No. 14 Tahun 2008.
          </p>
          <Link
            href="/ppid/sk-dikecualikan"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            Lihat Daftar Informasi Dikecualikan <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── Maklumat ── */}
      {maklumat && (
        <div
          className="rounded-2xl p-5 flex items-start gap-4"
          style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}
        >
          <CheckCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-yellow-800 mb-1">Maklumat Pelayanan</p>
            <p
              className="text-xs text-yellow-700 leading-relaxed line-clamp-3"
              dangerouslySetInnerHTML={{ __html: maklumat.konten.substring(0, 280) + '...' }}
            />
            <Link
              href="/ppid/maklumat"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 mt-2 hover:text-yellow-900 transition-colors"
            >
              Baca Selengkapnya <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Kontak ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Kontak Layanan PPID</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: <Phone   className="w-4 h-4" />, label: 'Telepon',  nilai: '(0380) 831021',                   color: '#0D47A1', bg: '#EFF6FF' },
            { icon: <Mail    className="w-4 h-4" />, label: 'Email',    nilai: 'biroorganisasi@nttprov.go.id',    color: '#065F46', bg: '#ECFDF5' },
            { icon: <MapPin  className="w-4 h-4" />, label: 'Alamat',   nilai: 'Jl. El Tari II, Kupang, NTT',    color: '#B45309', bg: '#FFFBEB' },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: k.bg, border: `1px solid ${k.color}18` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${k.color}15`, color: k.color }}
              >
                {k.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: `${k.color}80` }}>
                  {k.label}
                </p>
                <p className="text-xs font-semibold leading-snug" style={{ color: k.color }}>{k.nilai}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Permohonan ── */}
      <div
        className="rounded-2xl p-5 flex items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #0A2342, #0D47A1)', border: '1px solid #1565C0' }}
      >
        <div>
          <p className="text-sm font-bold text-white mb-0.5">Ingin Mengajukan Permohonan?</p>
          <p className="text-xs text-white/60">Ajukan permohonan informasi publik secara online. Diproses dalam 10 hari kerja.</p>
        </div>
        <Link
          href="/ppid/permohonan"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-105"
          style={{ background: '#F5A623', color: '#0A2342' }}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Ajukan Sekarang
        </Link>
      </div>

    </div>
  )
}