import type { Metadata } from 'next'
import { FileText, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Daftar Informasi',
  description: 'Daftar Informasi Publik PPID Biro Organisasi Setda Provinsi NTT',
}

const daftarInformasi = [
  {
    label: 'Informasi Setiap Saat',
    href: 'https://drive.google.com/drive/folders/1eCYfgChjlq-AyjPt1-KXx3-BWlxLVZo5?usp=sharing',
    deskripsi: 'Informasi yang dapat diakses kapan saja oleh masyarakat.',
    color: '#0D47A1',
    bg: '#EFF6FF',
  },
  {
    label: 'Informasi Berkala',
    href: 'https://drive.google.com/drive/folders/1P7xUX6WNE7KjJw2Ju3ELcdJk2y2ejR2Y?usp=sharing',
    deskripsi: 'Informasi yang wajib diumumkan secara berkala.',
    color: '#065F46',
    bg: '#ECFDF5',
  },
  {
    label: 'Daftar Informasi Dikecualikan',
    href: 'https://drive.google.com/drive/folders/1P7xUX6WNE7KjJw2Ju3ELcdJk2y2ejR2Y?usp=sharing',
    deskripsi: 'Informasi yang dikecualikan sesuai ketentuan UU KIP.',
    color: '#9D174D',
    bg: '#FFF1F2',
  },
]

export default function DaftarInformasiPage() {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-2xl p-6"
        style={{ background: 'white', border: '1px solid #DBEAFE' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1
            className="text-xl font-bold"
            style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}
          >
            Daftar Informasi Publik
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Informasi yang tersedia dan dapat diakses oleh masyarakat sesuai ketentuan UU KIP No. 14 Tahun 2008.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {daftarInformasi.map(function(item) {
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-5 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ background: 'white', border: '1px solid ' + item.color + '25' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: item.bg }}
                >
                  <FileText className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: item.color }}>
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.deskripsi}</p>
                </div>
              </div>
              <div
                className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                style={{
                  background: item.bg,
                  color: item.color,
                  border: '1px solid ' + item.color + '25',
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Buka
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}