// app/profil/tugas-pokok-fungsi/page.tsx
import { prisma } from '@/lib/prisma'
import { ClipboardList } from 'lucide-react'
import ProfilPageHeader from '@/components/shared/ProfilPageHeader'
import ProfilSidebar from '@/components/shared/ProfilSidebar'

export const metadata = { title: 'Tugas Pokok dan Fungsi — Biro Organisasi NTT' }

export default async function TugasPokokFungsiPage() {
  const items = await prisma.tugasPokokFungsi.findMany({
    orderBy: { urutan: 'asc' },
  })

  return (
    <>
      {/* ── Page Header ── */}
      <ProfilPageHeader
        eyebrow="Profil"
        title="Tugas Pokok dan Fungsi"
        description="Tugas pokok dan fungsi Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur berdasarkan peraturan perundang-undangan yang berlaku."
        icon={<ClipboardList className="w-7 h-7" />}
        bgIndex={2}
        breadcrumbs={[
          { label: 'Beranda', href: '/' },
          { label: 'Profil', href: '/profil/sekapur-sirih' },
          { label: 'Tugas Pokok dan Fungsi' },
        ]}
      />

      {/* ── Body ── */}
      <section className="py-12 px-4" style={{ background: '#F4F7FD' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">

            {/* ── Main content ── */}
            <div className="flex flex-col gap-5">

              {items.length > 0 ? (
                items.map((item, i) => (
                  <div
                    key={item.id}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'white',
                      border: '1px solid #DBEAFE',
                      boxShadow: '0 2px 12px rgba(13,71,161,0.06)',
                    }}
                  >
                    {/* Card header with number */}
                    <div
                      className="flex items-center gap-4 px-6 py-4"
                      style={{ borderBottom: '1px solid #EFF6FF', background: '#F8FAFF' }}
                    >
                      {/* Number badge */}
                      <div
                        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
                        style={{
                          background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
                          color: 'white',
                          boxShadow: '0 3px 10px rgba(13,71,161,0.30)',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>

                      <h3
                        className="text-sm font-bold leading-snug"
                        style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}
                      >
                        {item.judul}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-5">
                      <div
                        className="prose prose-sm max-w-none"
                        style={{ color: '#4B5563', lineHeight: '1.85' }}
                        dangerouslySetInnerHTML={{ __html: item.konten }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{ background: 'white', border: '1px solid #DBEAFE' }}
                >
                  <ClipboardList className="w-10 h-10 mx-auto mb-3" style={{ color: '#BFDBFE' }} />
                  <p className="text-sm font-semibold" style={{ color: '#94A3B8' }}>
                    Data tugas pokok dan fungsi belum tersedia.
                  </p>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <ProfilSidebar
              activeHref="/profil/tugas-pokok-fungsi"
              title="Tugas Pokok & Fungsi"
              description="Uraian tugas dan fungsi Biro Organisasi Setda Provinsi NTT."
            />
          </div>
        </div>
      </section>
    </>
  )
}