// app/(public)/unit-kerja/page.tsx
import { prisma }       from '@/lib/prisma'
import Link             from 'next/link'
import type { Metadata } from 'next'
import {
  Building2,
  ClipboardList,
  RefreshCw,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Unit Kerja',
  description: 'Tiga unit kerja utama Biro Organisasi Setda Provinsi NTT: Kelembagaan & Analisis Jabatan, Reformasi Birokrasi & Akuntabilitas, dan Tata Laksana.',
}

// ─── Config visual per bagian ─────────────────────────────────────────────────
const bagianConfig: Record<
  string,
  {
    href: string
    icon: React.ReactNode
    color: string
    colorLight: string
    colorDark: string
    ringkasan: string
    fungsiUtama: string[]
  }
> = {
  KELEMBAGAAN_ANALISIS_JABATAN: {
    href:       '/unit-kerja/kelembagaan-analisis-jabatan',
    icon:       <Building2     className="w-8 h-8" />,
    color:      '#0D47A1',
    colorLight: '#EFF6FF',
    colorDark:  '#1E3A5F',
    ringkasan:
      'Bertanggung jawab dalam penataan kelembagaan perangkat daerah serta pelaksanaan analisis jabatan dan analisis beban kerja ASN Provinsi NTT.',
    fungsiUtama: [
      'Penataan dan evaluasi kelembagaan perangkat daerah',
      'Analisis jabatan struktural dan fungsional',
      'Analisis beban kerja ASN',
      'Fasilitasi penyusunan uraian tugas jabatan',
      'Koordinasi kelembagaan lintas OPD',
    ],
  },
  REFORMASI_BIROKRASI_AKUNTABILITAS: {
    href:       '/unit-kerja/reformasi-birokrasi-akuntabilitas',
    icon:       <RefreshCw     className="w-8 h-8" />,
    color:      '#065F46',
    colorLight: '#ECFDF5',
    colorDark:  '#064E3B',
    ringkasan:
      'Mengoordinasikan pelaksanaan reformasi birokrasi, akuntabilitas kinerja, serta pembangunan zona integritas menuju WBK/WBBM di lingkup Pemprov NTT.',
    fungsiUtama: [
      'Koordinasi pelaksanaan Reformasi Birokrasi',
      'Penilaian Mandiri Pelaksanaan Reformasi Birokrasi (PMPRB)',
      'Pembangunan Zona Integritas (ZI) WBK/WBBM',
      'Fasilitasi SAKIP dan akuntabilitas kinerja',
      'Monitoring dan evaluasi capaian reformasi birokrasi',
    ],
  },
  TATA_LAKSANA: {
    href:       '/unit-kerja/tata-laksana',
    icon:       <ClipboardList className="w-8 h-8" />,
    color:      '#7C3AED',
    colorLight: '#F5F3FF',
    colorDark:  '#5B21B6',
    ringkasan:
      'Bertanggung jawab dalam penataan proses bisnis, penyusunan SOP, pelaksanaan survei kepuasan masyarakat, serta pengembangan sistem manajemen mutu organisasi.',
    fungsiUtama: [
      'Penyusunan dan evaluasi Standar Operasional Prosedur (SOP)',
      'Pemetaan dan penataan proses bisnis pemerintah daerah',
      'Pelaksanaan Survei Kepuasan Masyarakat (SKM)',
      'Pengembangan sistem manajemen mutu',
      'Pembinaan pelayanan publik OPD',
    ],
  },
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function UnitKerjaPage() {
  const bagianList = await prisma.bagian.findMany({
    orderBy: { urutan: 'asc' },
    select: { id: true, slug: true, nama: true, deskripsi: true, konten: true },
  })

  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="relative py-16 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0A2342 0%, #0D47A1 55%, #1565C0 100%)',
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="uk-idx-dot" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#uk-idx-dot)" />
        </svg>

        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-white/80 transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
              Beranda
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Unit Kerja</span>
          </div>

          <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-2">
            Biro Organisasi Setda NTT
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Unit Kerja
          </h1>
          <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
            Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur terdiri dari tiga unit kerja yang masing-masing memiliki tugas dan fungsi strategis dalam mendukung tata kelola pemerintahan daerah.
          </p>

          {/* Accent lines */}
          <div className="flex items-center gap-1.5 mt-5">
            <div className="w-10 h-0.75 rounded-full bg-white/80" />
            <div className="w-4 h-0.75 rounded-full" style={{ backgroundColor: '#F5A623' }} />
          </div>
        </div>
      </section>

      {/* ── Cards ── */}
      <section className="py-14 px-4" style={{ background: '#F4F7FD' }}>
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          {bagianList.map((bagian, idx) => {
            const cfg = bagianConfig[bagian.slug]
            if (!cfg) return null

            return (
              <div
                key={bagian.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  border: '1px solid #DBEAFE',
                  boxShadow: '0 2px 16px rgba(13,71,161,0.07)',
                }}
              >
                <div className="grid sm:grid-cols-3">

                  {/* LEFT accent panel */}
                  <div
                    className="relative flex flex-col justify-between p-6 sm:p-8"
                    style={{ background: `linear-gradient(160deg, ${cfg.colorDark}, ${cfg.color})` }}
                  >
                    {/* Nomor besar */}
                    <span
                      className="absolute top-4 right-5 text-6xl font-black leading-none select-none"
                      style={{ color: 'rgba(255,255,255,0.06)' }}
                    >
                      0{idx + 1}
                    </span>

                    <div>
                      <div
                        className="inline-flex p-3 rounded-xl mb-4"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                      >
                        <span className="text-white">{cfg.icon}</span>
                      </div>
                      <h2
                        className="text-lg font-bold text-white leading-snug"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {bagian.nama}
                      </h2>
                      <p className="text-xs text-white/55 mt-2 leading-relaxed">
                        {bagian.deskripsi ?? cfg.ringkasan}
                      </p>
                    </div>

                    <Link
                      href={cfg.href}
                      className="mt-6 self-start inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.25)',
                        textDecoration: 'none',
                      }}
                    >
                      Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* RIGHT — fungsi utama */}
                  <div className="sm:col-span-2 p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-5">
                      <div
                        className="w-1 h-5 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>
                        Fungsi Utama
                      </h3>
                    </div>

                    <ul className="flex flex-col gap-3">
                      {cfg.fungsiUtama.map((f, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                            style={{ backgroundColor: cfg.colorLight, color: cfg.color }}
                          >
                            {i + 1}
                          </div>
                          <span className="text-sm text-slate-600 leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA link detail */}
                    <Link
                      href={cfg.href}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:gap-2.5"
                      style={{ color: cfg.color, textDecoration: 'none' }}
                    >
                      Lihat Detail Lengkap <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}