// app/(public)/ppid/regulasi/page.tsx
import { prisma }        from '@/lib/prisma'
import type { Metadata } from 'next'
import { FileText, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Regulasi PPID',
  description: 'Regulasi dan dasar hukum PPID Biro Organisasi Setda Provinsi NTT',
}

// Warna per tipe peraturan
const tipeColor: Record<string, { color: string; bg: string }> = {
  UNDANG_UNDANG:          { color: '#7C3AED', bg: '#F5F3FF' },
  PERATURAN_PEMERINTAH:   { color: '#065F46', bg: '#ECFDF5' },
  PERATURAN_PRESIDEN:     { color: '#0D47A1', bg: '#EFF6FF' },
  PERATURAN_KEMENDAGRI:   { color: '#B45309', bg: '#FFFBEB' },
  PERATURAN_KEMENPANRB:   { color: '#9D174D', bg: '#FFF1F2' },
  PERATURAN_DAERAH:       { color: '#1E40AF', bg: '#EFF6FF' },
  PERATURAN_GUBERNUR:     { color: '#065F46', bg: '#ECFDF5' },
  KEPUTUSAN_GUBERNUR:     { color: '#B45309', bg: '#FFFBEB' },
}

const tipeLabel: Record<string, string> = {
  UNDANG_UNDANG:          'Undang-Undang',
  PERATURAN_PEMERINTAH:   'Peraturan Pemerintah',
  PERATURAN_PRESIDEN:     'Peraturan Presiden',
  PERATURAN_KEMENDAGRI:   'Permendagri',
  PERATURAN_KEMENPANRB:   'PermenPANRB',
  PERATURAN_DAERAH:       'Perda',
  PERATURAN_GUBERNUR:     'Pergub',
  KEPUTUSAN_GUBERNUR:     'Kepgub',
}

export default async function RegulasiPPIDPage() {
  const peraturanList = await prisma.peraturan.findMany({
    where:   { aktif: true },
    orderBy: [{ tahun: 'desc' }, { nomor: 'asc' }],
  })

  // Group by tipe
  const grouped = peraturanList.reduce<Record<string, typeof peraturanList>>((acc, p) => {
    const key = p.tipe
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  // Urutan tampil
  const urutan = [
    'UNDANG_UNDANG',
    'PERATURAN_PEMERINTAH',
    'PERATURAN_PRESIDEN',
    'PERATURAN_KEMENDAGRI',
    'PERATURAN_KEMENPANRB',
    'PERATURAN_DAERAH',
    'PERATURAN_GUBERNUR',
    'KEPUTUSAN_GUBERNUR',
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Regulasi PPID
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3 leading-relaxed">
          Dasar hukum penyelenggaraan keterbukaan informasi publik di Biro Organisasi Setda Provinsi NTT.
        </p>
      </div>

      {/* ── Grouped peraturan ── */}
      {peraturanList.length === 0 ? (
        <EmptyState label="Belum ada regulasi yang ditambahkan." />
      ) : (
        urutan.map((tipe) => {
          const list = grouped[tipe]
          if (!list?.length) return null
          const style = tipeColor[tipe] ?? { color: '#0D47A1', bg: '#EFF6FF' }
          return (
            <div key={tipe} className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
              {/* Group header */}
              <div className="px-5 py-3 flex items-center gap-2" style={{ background: style.bg, borderBottom: `1px solid ${style.color}18` }}>
                <FileText className="w-4 h-4 shrink-0" style={{ color: style.color }} />
                <h2 className="text-xs font-bold" style={{ color: style.color }}>
                  {tipeLabel[tipe] ?? tipe}
                </h2>
                <span
                  className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: style.color, color: 'white' }}
                >
                  {list.length}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-slate-100">
                {list.map((p) => (
                  <div key={p.id} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded"
                          style={{ background: style.bg, color: style.color }}
                        >
                          No. {p.nomor} Tahun {p.tahun}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 leading-snug mb-1">{p.judul}</p>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{p.tentang}</p>
                    </div>
                    {p.file && (
                      <a
                        href={p.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ background: style.bg, color: style.color, border: `1px solid ${style.color}30` }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl p-12 text-center" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
      <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}