// app/(public)/ppid/tugas-fungsi/page.tsx
import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tugas dan Fungsi PPID',
}

const tugasPPID = [
  'Menyimpan, mendokumentasikan, menyediakan, dan memberi pelayanan informasi kepada publik',
  'Melakukan verifikasi bahan informasi publik yang akan ditetapkan oleh atasan PPID sebagai informasi publik yang terbuka atau yang dikecualikan',
  'Melakukan uji konsekuensi atas informasi yang dikecualikan sebelum menyatakan informasi publik tertentu dikecualikan',
  'Melakukan pemutakhiran informasi dan dokumentasi',
  'Menyediakan informasi dan dokumentasi untuk diakses oleh masyarakat',
  'Melakukan koordinasi dengan unit kerja terkait dalam rangka pengumpulan informasi',
  'Mengajukan keberatan kepada atasan PPID berdasarkan pertimbangan tertulis dan prosedur tertentu',
  'Menyelesaikan sengketa informasi melalui mediasi dan/atau ajudikasi nonlitigasi bersama Komisi Informasi',
  'Membuat dan mengumumkan laporan pelayanan informasi publik',
  'Melaksanakan fungsi lain yang berkaitan dengan pengelolaan informasi dan dokumentasi',
]

const dasarHukum = [
  { nomor: 'UU No. 14 Tahun 2008',      tentang: 'Keterbukaan Informasi Publik' },
  { nomor: 'PP No. 61 Tahun 2010',       tentang: 'Pelaksanaan UU No. 14/2008' },
  { nomor: 'Permendagri No. 3 Tahun 2017', tentang: 'Pedoman Pengelolaan Pelayanan Informasi dan Dokumentasi Kemendagri' },
  { nomor: 'Perki No. 1 Tahun 2010',     tentang: 'Standar Layanan Informasi Publik' },
]

export default function TugasFungsiPPIDPage() {
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

      {/* Tugas */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Tugas PPID</h2>
        </div>
        <div className="flex flex-col gap-3">
          {tugasPPID.map((t, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                style={{ background: '#EFF6FF', color: '#0D47A1' }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dasar hukum */}
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