// app/profil/struktur-organisasi/page.tsx
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { Building2, ZoomIn } from 'lucide-react'
import ProfilPageHeader from '@/components/shared/ProfilPageHeader'
import ProfilSidebar from '@/components/shared/ProfilSidebar'

export const metadata = { title: 'Struktur Organisasi — Biro Organisasi NTT' }

export default async function StrukturOrganisasiPage() {
  const data = await prisma.strukturOrganisasi.findFirst({
    where: { aktif: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      {/* ── Page Header ── */}
      <ProfilPageHeader
        eyebrow="Profil"
        title="Struktur Organisasi"
        description="Susunan organisasi Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur beserta unit-unit kerjanya."
        icon={<Building2 className="w-7 h-7" />}
        bgIndex={1}
        breadcrumbs={[
          { label: 'Beranda', href: '/' },
          { label: 'Profil', href: '/profil/sekapur-sirih' },
          { label: 'Struktur Organisasi' },
        ]}
      />

      {/* ── Body ── */}
      <section className="py-12 px-4" style={{ background: '#F4F7FD' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">

            {/* ── Main content ── */}
            <div className="flex flex-col gap-6">

              {data ? (
                <>
                  {/* Bagan struktur */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'white',
                      border: '1px solid #DBEAFE',
                      boxShadow: '0 4px 20px rgba(13,71,161,0.07)',
                    }}
                  >
                    {/* Card header */}
                    <div
                      className="flex items-center justify-between px-6 py-4"
                      style={{ borderBottom: '1px solid #EFF6FF', background: '#F8FAFF' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
                        <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>
                          Bagan Struktur Organisasi
                        </h3>
                      </div>
                      <a
                        href={data.gambar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ background: '#EFF6FF', color: '#1565C0', border: '1px solid #BFDBFE' }}
                      >
                        <ZoomIn className="w-3.5 h-3.5" /> Perbesar
                      </a>
                    </div>

                    {/* Image */}
                    <div className="relative p-4 sm:p-6" style={{ background: 'white' }}>
                      <div className="relative w-full" style={{ minHeight: '400px' }}>
                        <Image
                          src={data.gambar}
                          alt="Struktur Organisasi Biro Organisasi NTT"
                          fill
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 70vw"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  {data.deskripsi && (
                    <div
                      className="rounded-2xl p-6"
                      style={{
                        background: 'white',
                        border: '1px solid #DBEAFE',
                        boxShadow: '0 2px 12px rgba(13,71,161,0.05)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
                        <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>
                          Keterangan
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                        {data.deskripsi}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{ background: 'white', border: '1px solid #DBEAFE' }}
                >
                  <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#BFDBFE' }} />
                  <p className="text-sm font-semibold" style={{ color: '#94A3B8' }}>
                    Bagan struktur organisasi belum tersedia.
                  </p>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <ProfilSidebar
              activeHref="/profil/struktur-organisasi"
              title="Struktur Organisasi"
              description="Susunan organisasi Biro Organisasi Setda Provinsi NTT."
            />
          </div>
        </div>
      </section>
    </>
  )
}