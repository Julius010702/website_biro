// app/profil/sekapur-sirih/page.tsx
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { User, Quote } from 'lucide-react'
import ProfilPageHeader from '@/components/shared/ProfilPageHeader'
import ProfilSidebar from '@/components/shared/ProfilSidebar'

export const metadata = { title: 'Tentang Kami — Biro Organisasi NTT' }

export default async function SekapurSirihPage() {
  const data = await prisma.sekapurSirih.findFirst({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      {/* ── Page Header ── */}
      <ProfilPageHeader
        eyebrow="Profil"
        title="Tentang Kami"
        description="Sambutan dan pengantar dari pimpinan Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur."
        icon={<User className="w-7 h-7" />}
        bgIndex={0}
        breadcrumbs={[
          { label: 'Beranda', href: '/' },
          { label: 'Profil', href: '/profil/sekapur-sirih' },
          { label: 'Tentang Kami' },
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
                  {/* Photo + quote card */}
                  {(data.foto || data.nama) && (
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: 'white',
                        border: '1px solid #DBEAFE',
                        boxShadow: '0 4px 20px rgba(13,71,161,0.07)',
                      }}
                    >
                      <div className="flex flex-col sm:flex-row gap-0">

                        {/* Photo column */}
                        {data.foto && (
                          <div
                            className="relative shrink-0"
                            style={{
                              width: '100%',
                              maxWidth: '220px',
                              minHeight: '260px',
                              background: 'linear-gradient(160deg, #0D47A1, #1976D2)',
                            }}
                          >
                            <Image
                              src={data.foto}
                              alt={data.nama ?? 'Kepala Biro'}
                              fill
                              className="object-cover object-top"
                              sizes="220px"
                            />
                            {/* Overlay bottom */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-24"
                              style={{ background: 'linear-gradient(to top, rgba(13,71,161,0.7), transparent)' }}
                            />
                          </div>
                        )}

                        {/* Name + jabatan */}
                        <div className="flex flex-col justify-end p-6">
                          <div
                            className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full self-start text-[10px] font-black tracking-widest uppercase"
                            style={{ background: '#EFF6FF', color: '#1565C0', border: '1px solid #BFDBFE' }}
                          >
                            <Quote className="w-3 h-3" />
                            Sambutan Pimpinan
                          </div>
                          {data.nama && (
                            <h2
                              className="text-xl font-bold"
                              style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}
                            >
                              {data.nama}
                            </h2>
                          )}
                          {data.jabatan && (
                            <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                              {data.jabatan}
                            </p>
                          )}
                          {/* Accent */}
                          <div className="flex items-center gap-1.5 mt-3">
                            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
                            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Konten */}
                  <div
                    className="rounded-2xl p-6 sm:p-8"
                    style={{
                      background: 'white',
                      border: '1px solid #DBEAFE',
                      boxShadow: '0 2px 12px rgba(13,71,161,0.06)',
                    }}
                  >
                    {/* Section title */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
                      <h3 className="text-base font-bold" style={{ color: '#0A2342' }}>
                        {data.judul}
                      </h3>
                    </div>

                    <div
                      className="prose prose-sm max-w-none"
                      style={{ color: '#374151', lineHeight: '1.85' }}
                      dangerouslySetInnerHTML={{ __html: data.konten }}
                    />
                  </div>
                </>
              ) : (
                /* Empty state */
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{ background: 'white', border: '1px solid #DBEAFE' }}
                >
                  <User className="w-10 h-10 mx-auto mb-3" style={{ color: '#BFDBFE' }} />
                  <p className="text-sm font-semibold" style={{ color: '#94A3B8' }}>
                    Konten belum tersedia.
                  </p>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <ProfilSidebar
              activeHref="/profil/sekapur-sirih"
              title="Tentang Kami"
              description="Sambutan pimpinan Biro Organisasi Setda Provinsi Nusa Tenggara Timur."
            />
          </div>
        </div>
      </section>
    </>
  )
}