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

// Struktur PPID statis (sesuaikan dengan data aktual)
const strukturPPID = [
  {
    jabatan:   'Atasan PPID',
    nama:      'Kepala Biro Organisasi',
    level:     0,
    color:     '#0A2342',
    bg:        '#E8EFF8',
  },
  {
    jabatan:   'PPID Pelaksana',
    nama:      'Sekretaris / Kasubbag',
    level:     1,
    color:     '#0D47A1',
    bg:        '#EFF6FF',
  },
  {
    jabatan:   'Bidang Pengolahan Data & Klasifikasi',
    nama:      'Staf Pengelola Informasi',
    level:     2,
    color:     '#065F46',
    bg:        '#ECFDF5',
  },
  {
    jabatan:   'Bidang Pelayanan & Dokumentasi',
    nama:      'Staf Pelayanan Informasi',
    level:     2,
    color:     '#7C3AED',
    bg:        '#F5F3FF',
  },
  {
    jabatan:   'Bidang Keberatan & Penyelesaian Sengketa',
    nama:      'Staf Hukum & Advokasi',
    level:     2,
    color:     '#B45309',
    bg:        '#FFFBEB',
  },
]

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

      {/* ── Bagan visual ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Susunan Jabatan PPID</h2>
        </div>

        <div className="flex flex-col items-center gap-0">
          {strukturPPID.filter((s) => s.level < 2).map((s, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              {/* Card jabatan */}
              <div
                className={`rounded-xl px-5 py-3 text-center transition-all hover:scale-105 ${
                  s.level === 0 ? 'w-64' : 'w-56'
                }`}
                style={{
                  background: s.bg,
                  border: `1px solid ${s.color}30`,
                  boxShadow: `0 2px 12px ${s.color}12`,
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: `${s.color}80` }}>
                  {s.jabatan}
                </p>
                <p className="text-sm font-bold" style={{ color: s.color }}>{s.nama}</p>
              </div>

              {/* Connector line */}
              <div className="w-px h-6 bg-slate-200" />
            </div>
          ))}

          {/* Level 2 — ditampilkan horizontal */}
          <div className="w-full">
            <div className="flex items-start justify-center gap-3 flex-wrap">
              {strukturPPID.filter((s) => s.level === 2).map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl px-4 py-3 text-center flex-1 min-w-40 max-w-xs transition-all hover:scale-105"
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.color}30`,
                    boxShadow: `0 2px 12px ${s.color}12`,
                  }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: `${s.color}80` }}>
                    {s.jabatan}
                  </p>
                  <p className="text-xs font-bold" style={{ color: s.color }}>{s.nama}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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