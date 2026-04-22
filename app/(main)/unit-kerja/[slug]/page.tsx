// app/(public)/unit-kerja/[slug]/page.tsx
import { notFound }          from 'next/navigation'
import { prisma }            from '@/lib/prisma'
import { BagianSlug }        from '@prisma/client'
import { pathToBagianSlug }  from '@/lib/navigation'
import type { Metadata }     from 'next'
import {
  Building2,
  ClipboardList,
  RefreshCw,
  ChevronRight,
  FileText,
} from 'lucide-react'

// ─── Static params dari 3 slug yang valid ────────────────────────────────────
export async function generateStaticParams() {
  return [
    { slug: 'kelembagaan-analisis-jabatan' },
    { slug: 'reformasi-birokrasi-akuntabilitas' },
    { slug: 'tata-laksana' },
  ]
}

// ─── Metadata dinamis ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const prismaSlug = pathToBagianSlug[slug]
  if (!prismaSlug) return { title: 'Tidak Ditemukan' }

  const bagian = await prisma.bagian.findUnique({
    where: { slug: prismaSlug as BagianSlug },
    select: { nama: true, deskripsi: true },
  })

  if (!bagian) return { title: 'Tidak Ditemukan' }

  return {
    title: bagian.nama,
    description: bagian.deskripsi ?? `Informasi ${bagian.nama} Biro Organisasi Setda NTT`,
  }
}

// ─── Icon & warna per bagian ─────────────────────────────────────────────────
const bagianMeta: Record<
  string,
  { icon: React.ReactNode; color: string; colorLight: string; label: string }
> = {
  KELEMBAGAAN_ANALISIS_JABATAN: {
    icon:       <Building2  className="w-7 h-7" />,
    color:      '#0D47A1',
    colorLight: '#EFF6FF',
    label:      'Kelembagaan & Analisis Jabatan',
  },
  REFORMASI_BIROKRASI_AKUNTABILITAS: {
    icon:       <RefreshCw  className="w-7 h-7" />,
    color:      '#065F46',
    colorLight: '#ECFDF5',
    label:      'Reformasi Birokrasi & Akuntabilitas',
  },
  TATA_LAKSANA: {
    icon:       <ClipboardList className="w-7 h-7" />,
    color:      '#7C3AED',
    colorLight: '#F5F3FF',
    label:      'Tata Laksana',
  },
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function UnitKerjaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const prismaSlug = pathToBagianSlug[slug]
  if (!prismaSlug) notFound()

  const bagian = await prisma.bagian.findUnique({
    where: { slug: prismaSlug as BagianSlug },
  })
  if (!bagian) notFound()

  // Ambil tugas pokok & fungsi (semua, lalu filter manual jika perlu)
  const tugasList = await prisma.tugasPokokFungsi.findMany({
    orderBy: { urutan: 'asc' },
  })

  const meta = bagianMeta[bagian.slug] ?? bagianMeta['KELEMBAGAAN_ANALISIS_JABATAN']

  return (
    <main>
      {/* ── Hero banner ── */}
      <section
        className="relative py-16 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #0A2342 0%, ${meta.color} 60%, #1E88E5 100%)`,
        }}
      >
        {/* Pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="uk-stripe" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="white" strokeWidth="10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#uk-stripe)" />
        </svg>

        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <span>Beranda</span>
            <ChevronRight className="w-3 h-3" />
            <span>Unit Kerja</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">{bagian.nama}</span>
          </div>

          {/* Icon + Title */}
          <div className="flex items-start gap-5">
            <div
              className="p-4 rounded-2xl shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <span className="text-white">{meta.icon}</span>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-1">
                Unit Kerja
              </p>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {bagian.nama}
              </h1>
              {bagian.deskripsi && (
                <p className="mt-3 text-sm text-white/60 max-w-2xl leading-relaxed">
                  {bagian.deskripsi}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Konten utama ── */}
      <section className="py-12 px-4" style={{ background: '#F4F7FD' }}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">

          {/* LEFT: Konten rich text */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Deskripsi / Konten */}
            {bagian.konten && (
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{ background: 'white', border: '1px solid #DBEAFE' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <h2
                    className="text-base font-bold"
                    style={{ color: '#0A2342' }}
                  >
                    Tentang {bagian.nama}
                  </h2>
                </div>
                <div
                  className="prose prose-sm max-w-none text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: bagian.konten }}
                />
              </div>
            )}

            {/* Tugas Pokok & Fungsi */}
            {tugasList.length > 0 && (
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{ background: 'white', border: '1px solid #DBEAFE' }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>
                    Tugas Pokok dan Fungsi
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {tugasList.map((t, i) => (
                    <div key={t.id} className="flex gap-4">
                      {/* Nomor */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{ backgroundColor: meta.colorLight, color: meta.color }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 mb-1">{t.judul}</p>
                        <div
                          className="prose prose-sm max-w-none text-slate-500 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: t.konten }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar info */}
          <div className="flex flex-col gap-4">

            {/* Info card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: meta.colorLight, border: `1px solid ${meta.color}22` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span style={{ color: meta.color }}>{meta.icon}</span>
                <h3 className="text-sm font-bold" style={{ color: meta.color }}>
                  {meta.label}
                </h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: `${meta.color}99` }}>
                Bagian ini merupakan salah satu unit kerja di bawah Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur.
              </p>
            </div>

            {/* Unit kerja lain */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'white', border: '1px solid #DBEAFE' }}
            >
              <h3 className="text-sm font-bold mb-3" style={{ color: '#0A2342' }}>
                Unit Kerja Lainnya
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Kelembagaan & Analisis Jabatan',      href: '/unit-kerja/kelembagaan-analisis-jabatan' },
                  { label: 'Reformasi Birokrasi & Akuntabilitas', href: '/unit-kerja/reformasi-birokrasi-akuntabilitas' },
                  { label: 'Tata Laksana',                        href: '/unit-kerja/tata-laksana' },
                ]
                  .filter((u) => !u.href.includes(slug))
                  .map((u) => (
                    <a
                      key={u.href}
                      href={u.href}
                      className="flex items-center gap-2 text-xs font-medium px-3 py-2.5 rounded-xl transition-all hover:translate-x-1"
                      style={{
                        color: '#1565C0',
                        background: '#EFF6FF',
                        border: '1px solid #DBEAFE',
                        textDecoration: 'none',
                      }}
                    >
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                      {u.label}
                    </a>
                  ))}
              </div>
            </div>

            {/* Download dokumen pendukung (opsional — muncul jika ada) */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'white', border: '1px solid #DBEAFE' }}
            >
              <h3 className="text-sm font-bold mb-3" style={{ color: '#0A2342' }}>
                Dokumen Pendukung
              </h3>
              <a
                href="/profil/tugas-pokok-fungsi"
                className="flex items-center gap-2.5 text-xs font-medium px-3 py-2.5 rounded-xl"
                style={{
                  background: '#EFF6FF',
                  color: '#1565C0',
                  border: '1px solid #DBEAFE',
                  textDecoration: 'none',
                }}
              >
                <FileText className="w-4 h-4 shrink-0" />
                Tugas Pokok & Fungsi Lengkap
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}