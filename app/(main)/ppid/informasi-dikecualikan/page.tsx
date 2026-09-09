// app/(main)/ppid/informasi-dikecualikan/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Daftar Informasi Dikecualikan',
  description: 'Daftar Informasi Dikecualikan PPID Biro Organisasi Setda Provinsi NTT',
}

const DRIVE_URL = 'https://drive.google.com/drive/folders/1P7xUX6WNE7KjJw2Ju3ELcdJk2y2ejR2Y'

export default function InformasiDikecualikanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Daftar Informasi Dikecualikan
          </h1>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2342, #0D47A1)', border: '1px solid #0D47A1' }}
      >
        <div className="absolute top-4 right-4 opacity-10">
          <Lock className="w-24 h-24 text-white" />
        </div>

        <div className="relative flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl"
              style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.3)' }}
            >
              <Lock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-sm font-bold text-white">Informasi Dikecualikan</p>
          </div>

          <p className="text-sm text-white/80 leading-relaxed">
            Informasi Dikecualikan merupakan informasi yang tidak dapat diakses oleh Pemohon
            Informasi Publik sebagaimana dimaksud dalam Undang-Undang Nomor 14 Tahun 2008
            tentang Keterbukaan Informasi Publik.
          </p>

          <Link
            href={DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: '#F5A623', color: '#0A2342' }}
          >
            <ExternalLink className="w-4 h-4" />
            Buka Daftar Informasi Dikecualikan
          </Link>
        </div>
      </div>
    </div>
  )
}
