// app/(public)/ppid/daftar-informasi/page.tsx
import { prisma }        from '@/lib/prisma'
import type { Metadata } from 'next'
import type { KategoriPPID } from '@prisma/client'
import { FileText, Download } from 'lucide-react'
import TahunFilter from './_TahunFilter'
export const metadata: Metadata = {
  title: 'Daftar Informasi',
  description: 'Daftar Informasi Publik PPID Biro Organisasi Setda Provinsi NTT',
}

const kategoriLabel: Record<string, string> = {
  TUGAS_FUNGSI:           'Tugas & Fungsi',
  STRUKTUR_ORGANISASI:    'Struktur Organisasi PPID',
  MAKLUMAT:               'Maklumat',
  DOKUMEN_ANGGARAN:       'Dokumen Anggaran',
  PROSEDUR_BENCANA:       'Prosedur Bencana',
  SK_DIKECUALIKAN:        'SK Dikecualikan',
  SK_DAFTAR_INFORMASI:    'SK Daftar Informasi',
  DAFTAR_INFORMASI:       'Daftar Informasi',
}

const kategoriColor: Record<string, { color: string; bg: string }> = {
  TUGAS_FUNGSI:           { color: '#0D47A1', bg: '#EFF6FF' },
  STRUKTUR_ORGANISASI:    { color: '#065F46', bg: '#ECFDF5' },
  MAKLUMAT:               { color: '#B45309', bg: '#FFFBEB' },
  DOKUMEN_ANGGARAN:       { color: '#9D174D', bg: '#FFF1F2' },
  PROSEDUR_BENCANA:       { color: '#C2410C', bg: '#FFF7ED' },
  SK_DIKECUALIKAN:        { color: '#1D4ED8', bg: '#EFF6FF' },
  SK_DAFTAR_INFORMASI:    { color: '#0F766E', bg: '#F0FDFA' },
  DAFTAR_INFORMASI:       { color: '#6D28D9', bg: '#F5F3FF' },
}

export default async function DaftarInformasiPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; tahun?: string }>
}) {
  const { kategori: katParam, tahun: tahunParam } = await searchParams

  const where: {
    aktif: boolean
    kategori?: KategoriPPID
    tahun?: number
  } = { aktif: true }

  if (katParam) where.kategori = katParam as KategoriPPID
  if (tahunParam) where.tahun = parseInt(tahunParam)

  const [dokumenList, semua] = await Promise.all([
    prisma.dokumenPPID.findMany({
      where,
      orderBy: [{ kategori: 'asc' }, { judul: 'asc' }],
    }),
    prisma.dokumenPPID.findMany({
      where: { aktif: true },
      select: { kategori: true, tahun: true },
    }),
  ])

  // Hitung per kategori
  const countPerKat = semua.reduce<Record<string, number>>((acc, d) => {
    acc[d.kategori] = (acc[d.kategori] ?? 0) + 1
    return acc
  }, {})

  // Tahun tersedia
  const tahunList = [...new Set(semua.map((d) => d.tahun).filter(Boolean))].sort((a, b) => (b ?? 0) - (a ?? 0))

  // Group by kategori (untuk tampilan tanpa filter)
  const grouped = dokumenList.reduce<Record<string, typeof dokumenList>>((acc, d) => {
    const key = d.kategori
    if (!acc[key]) acc[key] = []
    acc[key].push(d)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Daftar Informasi Publik
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Informasi yang tersedia dan dapat diakses oleh masyarakat sesuai ketentuan UU KIP No. 14 Tahun 2008.
        </p>
      </div>

      {/* ── Filter chips ── */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Semua */}
        <a
          href="/ppid/daftar-informasi"
          className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
          style={{
            background: !katParam ? '#0D47A1' : '#EFF6FF',
            color:      !katParam ? 'white'   : '#1565C0',
            border: '1px solid #DBEAFE',
          }}
        >
          Semua ({semua.length})
        </a>

        {Object.entries(countPerKat).map(([kat, count]) => {
          const style = kategoriColor[kat] ?? { color: '#0D47A1', bg: '#EFF6FF' }
          const active = katParam === kat
          return (
            <a
              key={kat}
              href={`/ppid/daftar-informasi?kategori=${kat}`}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{
                background: active ? style.color : style.bg,
                color:      active ? 'white'     : style.color,
                border: `1px solid ${style.color}30`,
              }}
            >
              {kategoriLabel[kat] ?? kat} ({count})
            </a>
          )
        })}

        {/* Filter tahun — Client Component */}
        <TahunFilter
          tahunList={tahunList}
          tahunParam={tahunParam}
          katParam={katParam}
        />
      </div>

      {/* ── Dokumen list ── */}
      {dokumenList.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
          <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-sm text-slate-400">Tidak ada dokumen ditemukan.</p>
        </div>
      ) : katParam ? (
        // Single category list
        <DokumenTable list={dokumenList} kat={katParam} />
      ) : (
        // Grouped
        Object.entries(grouped).map(([kat, list]) => {
          const style = kategoriColor[kat] ?? { color: '#0D47A1', bg: '#EFF6FF' }
          return (
            <div key={kat} className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
              <div className="px-5 py-3 flex items-center gap-2" style={{ background: style.bg }}>
                <FileText className="w-4 h-4 shrink-0" style={{ color: style.color }} />
                <h2 className="text-xs font-bold" style={{ color: style.color }}>{kategoriLabel[kat] ?? kat}</h2>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: style.color, color: 'white' }}>
                  {list.length}
                </span>
              </div>
              <DokumenTable list={list} kat={kat} />
            </div>
          )
        })
      )}
    </div>
  )
}

// ─── Sub-component tabel dokumen ─────────────────────────────────────────────
function DokumenTable({
  list,
  kat,
}: {
  list: Array<{
    id: string
    judul: string
    deskripsi: string | null
    file: string | null
    tahun: number | null
    kategori: string
  }>
  kat: string
}) {
  const style = kategoriColor[kat] ?? { color: '#0D47A1', bg: '#EFF6FF' }

  return (
    <div className="divide-y divide-slate-100">
      {list.map((d, i) => (
        <div
          key={d.id}
          className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span
              className="text-[11px] font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: style.bg, color: style.color }}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 leading-snug">{d.judul}</p>
              {d.deskripsi && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-1">{d.deskripsi}</p>}
              {d.tahun && <span className="text-[10px] text-slate-400 mt-0.5 block">Tahun {d.tahun}</span>}
            </div>
          </div>
          {d.file ? (
            <a
              href={d.file}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: style.bg, color: style.color, border: `1px solid ${style.color}25` }}
            >
              <Download className="w-3.5 h-3.5" /> Unduh
            </a>
          ) : (
            <span className="text-[10px] text-slate-300 shrink-0">Tidak ada file</span>
          )}
        </div>
      ))}
    </div>
  )
}