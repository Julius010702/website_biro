// app/(public)/ppid/prosedur-bencana/page.tsx
import { prisma }        from '@/lib/prisma'
import type { Metadata } from 'next'
import { AlertTriangle, Download, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Prosedur Peringatan Dini Bencana',
  description: 'Prosedur peringatan dini dan penanggulangan bencana Biro Organisasi Setda NTT',
}

export default async function ProsedurBencanaPage() {
  const dokumen = await prisma.dokumenPPID.findMany({
    where:   { aktif: true, kategori: 'PROSEDUR_BENCANA' },
    orderBy: { judul: 'asc' },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#C2410C' }} />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Prosedur Peringatan Dini Bencana
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Prosedur dan panduan peringatan dini serta penanggulangan bencana di lingkungan Pemerintah Provinsi NTT.
        </p>
      </div>

      {/* Informasi penting */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
      >
        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-orange-800 mb-1">Informasi Penting</p>
          <p className="text-xs text-orange-700 leading-relaxed">
            Dalam keadaan darurat, segera hubungi BPBD Provinsi NTT di nomor <strong>0380-833-xxxx</strong> atau call center nasional <strong>119</strong>. Prosedur ini berlaku untuk seluruh ASN dan unit kerja di lingkungan Pemprov NTT.
          </p>
        </div>
      </div>

      {/* Dokumen */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#FFF7ED', borderBottom: '1px solid #FED7AA' }}>
          <FileText className="w-4 h-4 text-orange-600" />
          <h2 className="text-xs font-bold text-orange-700">Dokumen Prosedur</h2>
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">{dokumen.length}</span>
        </div>
        {dokumen.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-200" />
            <p className="text-xs text-slate-400">Dokumen belum tersedia.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {dokumen.map((d) => (
              <div key={d.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{d.judul}</p>
                  {d.deskripsi && <p className="text-xs text-slate-400 mt-0.5">{d.deskripsi}</p>}
                </div>
                {d.file && (
                  <a href={d.file} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:scale-105 transition-all"
                    style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA' }}>
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