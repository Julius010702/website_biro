// app/(public)/ppid/dokumen-anggaran/page.tsx
import PageHeader from '@/components/ui/PageHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dokumen Anggaran - PPID Biro Organisasi NTT' }

const dokumenList = [
  { tahun: '2024', judul: 'DPA Biro Organisasi TA 2024', tipe: 'DPA', ukuran: '2.4 MB' },
  { tahun: '2024', judul: 'RKA Biro Organisasi TA 2024', tipe: 'RKA', ukuran: '1.8 MB' },
  { tahun: '2023', judul: 'DPA Biro Organisasi TA 2023', tipe: 'DPA', ukuran: '2.1 MB' },
  { tahun: '2023', judul: 'RKA Biro Organisasi TA 2023', tipe: 'RKA', ukuran: '1.6 MB' },
  { tahun: '2023', judul: 'Laporan Realisasi Anggaran 2023', tipe: 'LRA', ukuran: '3.2 MB' },
]

export default function DokumenAnggaranPage() {
  return (
    <>
      <PageHeader
        title="Dokumen Anggaran"
        subtitle="Dokumen perencanaan dan realisasi anggaran Biro Organisasi"
        breadcrumbs={[{ label: 'PPID', href: '/ppid' }, { label: 'Dokumen Anggaran' }]}
      />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-ntt-red-700)' }}>
                <th className="text-left px-5 py-3 text-white font-semibold">Dokumen</th>
                <th className="text-left px-5 py-3 text-white font-semibold">Tahun</th>
                <th className="text-left px-5 py-3 text-white font-semibold">Tipe</th>
                <th className="text-left px-5 py-3 text-white font-semibold">Ukuran</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {dokumenList.map((d, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-5 py-3.5 font-medium text-gray-800">{d.judul}</td>
                  <td className="px-5 py-3.5 text-gray-600">{d.tahun}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: 'var(--color-ntt-gold-600)' }}>
                      {d.tipe}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{d.ukuran}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
                      style={{ backgroundColor: 'var(--color-ntt-red-700)' }}>
                      Unduh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}