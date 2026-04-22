// app/(public)/ppid/sk-dikecualikan/page.tsx
import { prisma }        from '@/lib/prisma'
import type { Metadata } from 'next'
import { Lock, Download, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Daftar Informasi Dikecualikan',
  description: 'SK dan daftar informasi yang dikecualikan PPID Biro Organisasi Setda NTT',
}

export default async function SKDikecualikanPage() {
  const dokumen = await prisma.dokumenPPID.findMany({
    where:   { aktif: true, kategori: { in: ['SK_DIKECUALIKAN', 'SK_DAFTAR_INFORMASI'] } },
    orderBy: { judul: 'asc' },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-800" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Daftar Informasi yang Dikecualikan
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Informasi yang dikecualikan berdasarkan ketentuan Pasal 17 UU Nomor 14 Tahun 2008 tentang KIP.
        </p>
      </div>

      <div className="rounded-2xl p-5 flex items-start gap-4" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Informasi yang dikecualikan adalah informasi yang apabila dibuka dapat menghambat proses penegakan hukum, mengganggu kepentingan perlindungan HAKI, atau membahayakan pertahanan dan keamanan negara, sesuai pasal 17 UU KIP.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#EFF6FF', borderBottom: '1px solid #DBEAFE' }}>
          <Lock className="w-4 h-4 text-blue-700" />
          <h2 className="text-xs font-bold text-blue-700">SK &amp; Dokumen Terkait</h2>
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-700 text-white">{dokumen.length}</span>
        </div>
        {dokumen.length === 0 ? (
          <div className="p-10 text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-slate-200" />
            <p className="text-xs text-slate-400">Dokumen belum tersedia.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {dokumen.map((d) => (
              <div key={d.id} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{d.judul}</p>
                  {d.deskripsi && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{d.deskripsi}</p>}
                  {d.tahun && <span className="text-[10px] text-slate-300 mt-1 block">Tahun {d.tahun}</span>}
                </div>
                {d.file && (
                  <a href={d.file} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:scale-105 transition-all"
                    style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #DBEAFE' }}>
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}