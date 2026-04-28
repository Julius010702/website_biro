// app/(public)/ppid/tugas-fungsi/page.tsx
import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Tugas dan Fungsi PPID',
}

const dasarHukum = [
  { nomor: 'UU No. 14 Tahun 2008',        tentang: 'Keterbukaan Informasi Publik' },
  { nomor: 'PP No. 61 Tahun 2010',         tentang: 'Pelaksanaan UU No. 14/2008' },
  { nomor: 'Permendagri No. 3 Tahun 2017', tentang: 'Pedoman Pengelolaan Pelayanan Informasi dan Dokumentasi Kemendagri' },
  { nomor: 'Perki No. 1 Tahun 2010',       tentang: 'Standar Layanan Informasi Publik' },
]

export default async function TugasFungsiPPIDPage() {
  const tugasList = await prisma.tugasFungsiPPID.findMany({
    orderBy: { urutan: 'asc' },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Tugas dan Fungsi PPID
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Tugas dan fungsi Pejabat Pengelola Informasi dan Dokumentasi (PPID) berdasarkan peraturan perundang-undangan.
        </p>
      </div>

      {/* Tugas dari DB */}
      {tugasList.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-blue-700" />
            <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Tugas PPID</h2>
          </div>
          <div className="flex flex-col gap-3">
            {tugasList.map((item, i) => (
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                  style={{ background: '#EFF6FF', color: '#0D47A1' }}
                >
                  {i + 1}
                </div>
                <div>
                  {item.judul && (
                    <p className="text-sm font-semibold text-slate-700 mb-0.5">{item.judul}</p>
                  )}
                  <p className="text-sm text-slate-600 leading-relaxed">{item.konten}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dasar Hukum */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Dasar Hukum</h2>
        </div>
        <div className="flex flex-col gap-3">
          {dasarHukum.map((d, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#F8FAFF', border: '1px solid #DBEAFE' }}>
              <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-800">{d.nomor}</p>
                <p className="text-xs text-slate-500 mt-0.5">tentang {d.tentang}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}