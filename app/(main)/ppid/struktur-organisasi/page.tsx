// app/(public)/ppid/struktur-organisasi/page.tsx
import { prisma }        from '@/lib/prisma'
import Image             from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Struktur Organisasi PPID',
  description: 'Struktur Organisasi PPID Pelaksana Biro Organisasi Setda Provinsi NTT',
}

// ── Helper: konversi Google Drive viewer URL → direct image URL ──────────────
function toDirectImageUrl(url: string): string {
  // Pola: https://drive.google.com/file/d/FILE_ID/view?...
  const match = url.match(/\/file\/d\/([^/]+)/)
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }
  return url
}

export default async function StrukturOrganisasiPPIDPage() {
  // Ambil gambar struktur dari DB jika ada
  const struktur = await prisma.strukturOrganisasi.findFirst({
    where: { aktif: true },
  })

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Struktur Organisasi PPID Pelaksana
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3 leading-relaxed">
          Susunan organisasi Pejabat Pengelola Informasi dan Dokumentasi (PPID) Pelaksana Biro Organisasi Setda Provinsi NTT.
        </p>
      </div>

      {/* ── Gambar struktur dari DB ── */}
      {struktur?.gambar && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
          <div className="relative w-full" style={{ minHeight: '300px' }}>
            <Image
              src={toDirectImageUrl(struktur.gambar)}
              alt="Struktur Organisasi PPID"
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 75vw"
            />
          </div>
          {struktur.deskripsi && (
            <p className="text-xs text-slate-500 text-center pb-4 px-4">{struktur.deskripsi}</p>
          )}
        </div>
      )}

      {/* ── Tugas PPID ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Tugas PPID Pelaksana</h2>
        </div>
        <div className="flex flex-col gap-3">
          {[
            'Menyimpan, mendokumentasikan, menyediakan, dan memberi pelayanan informasi kepada publik',
            'Melakukan verifikasi bahan informasi publik yang akan ditetapkan oleh atasan PPID',
            'Melakukan pemutakhiran informasi dan dokumentasi',
            'Menyediakan informasi dan dokumentasi untuk diakses oleh masyarakat',
            'Melakukan koordinasi dengan unit kerja terkait dalam rangka pengumpulan informasi',
            'Mengajukan keberatan kepada atasan PPID berdasarkan pertimbangan tertulis',
          ].map((t, i) => (
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
    </div>
  )
}