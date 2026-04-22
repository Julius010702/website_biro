// app/profil/bagian/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Layers } from 'lucide-react'
import type { BagianSlug } from '@prisma/client'
import ProfilPageHeader from '@/components/shared/ProfilPageHeader'
import ProfilSidebar from '@/components/shared/ProfilSidebar'

// ─── Slug → BagianSlug enum mapping ──────────────────────────────────────────
const slugToEnum: Record<string, BagianSlug> = {
  'kelembagaan-analisis-jabatan':      'KELEMBAGAAN_ANALISIS_JABATAN',
  'reformasi-birokrasi-akuntabilitas': 'REFORMASI_BIROKRASI_AKUNTABILITAS',
  'tata-laksana':                      'TATA_LAKSANA',
}

// bgIndex per bagian
const slugToBgIndex: Record<string, number> = {
  'kelembagaan-analisis-jabatan':      3,
  'reformasi-birokrasi-akuntabilitas': 4,
  'tata-laksana':                      5,
}

// ─── generateStaticParams ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  return Object.keys(slugToEnum).map((slug) => ({ slug }))
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const enumSlug = slugToEnum[slug]
  if (!enumSlug) return { title: 'Bagian — Biro Organisasi NTT' }
  const bagian = await prisma.bagian.findUnique({ where: { slug: enumSlug }, select: { nama: true } })
  return { title: `${bagian?.nama ?? 'Bagian'} — Biro Organisasi NTT` }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BagianDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const enumSlug = slugToEnum[slug]
  if (!enumSlug) notFound()

  const bagian = await prisma.bagian.findUnique({ where: { slug: enumSlug } })
  if (!bagian) notFound()

  const bgIndex = slugToBgIndex[slug] ?? 0
  const activeHref = `/profil/bagian/${slug}`

  return (
    <>
      {/* ── Page Header ── */}
      <ProfilPageHeader
        eyebrow="Bagian"
        title={bagian.nama}
        description={bagian.deskripsi ?? undefined}
        icon={<Layers className="w-7 h-7" />}
        bgIndex={bgIndex}
        breadcrumbs={[
          { label: 'Beranda', href: '/' },
          { label: 'Profil', href: '/profil/sekapur-sirih' },
          { label: 'Bagian', href: '/profil/sekapur-sirih' },
          { label: bagian.nama },
        ]}
      />

      {/* ── Body ── */}
      <section className="py-12 px-4" style={{ background: '#F4F7FD' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">

            {/* ── Main content ── */}
            <div className="flex flex-col gap-6">

              {/* Tentang card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  border: '1px solid #DBEAFE',
                  boxShadow: '0 4px 20px rgba(13,71,161,0.07)',
                }}
              >
                <div
                  className="px-6 py-4"
                  style={{ borderBottom: '1px solid #EFF6FF', background: '#F8FAFF' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
                    <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>
                      Tentang {bagian.nama}
                    </h3>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {bagian.konten ? (
                    <div
                      className="prose prose-sm max-w-none"
                      style={{ color: '#374151', lineHeight: '1.85' }}
                      dangerouslySetInnerHTML={{ __html: bagian.konten }}
                    />
                  ) : bagian.deskripsi ? (
                    <p className="text-sm leading-relaxed" style={{ color: '#4B5563', lineHeight: '1.85' }}>
                      {bagian.deskripsi}
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: '#94A3B8' }}>
                      Konten detail belum tersedia.
                    </p>
                  )}
                </div>
              </div>

              {/* Info strip */}
              <div
                className="rounded-2xl p-5 flex flex-wrap gap-4"
                style={{
                  background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
                  boxShadow: '0 4px 20px rgba(13,71,161,0.25)',
                }}
              >
                <div className="flex-1 min-w-40">
                  <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Unit
                  </p>
                  <p className="text-sm font-bold text-white">{bagian.nama}</p>
                </div>
                <div className="flex-1 min-w-40">
                  <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Induk
                  </p>
                  <p className="text-sm font-bold text-white">Biro Organisasi</p>
                </div>
                <div className="flex-1 min-w-40">
                  <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Instansi
                  </p>
                  <p className="text-sm font-bold text-white">Setda Provinsi NTT</p>
                </div>
              </div>

            </div>

            {/* ── Sidebar ── */}
            <ProfilSidebar
              activeHref={activeHref}
              title={bagian.nama}
              description={bagian.deskripsi ?? 'Bagian ini merupakan salah satu unit kerja di bawah Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur.'}
            />
          </div>
        </div>
      </section>
    </>
  )
}