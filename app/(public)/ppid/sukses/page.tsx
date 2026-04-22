// app/(public)/ppid/permohonan/sukses/page.tsx
import Link             from 'next/link'
import type { Metadata } from 'next'
import { CheckCircle, Copy, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'Permohonan Berhasil' }

export default async function PermohonanSuksesPage({
  searchParams,
}: {
  searchParams: Promise<{ nomor?: string }>
}) {
  const { nomor } = await searchParams

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-2xl p-10 text-center flex flex-col items-center gap-4"
        style={{ background: 'white', border: '1px solid #DBEAFE' }}
      >
        {/* Icon sukses */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: '#ECFDF5', border: '2px solid #6EE7B7' }}
        >
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>

        <div>
          <h1 className="text-xl font-bold mb-2" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Permohonan Berhasil Dikirim!
          </h1>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            Terima kasih. Permohonan informasi Anda telah kami terima dan akan diproses dalam <strong>10 hari kerja</strong>.
          </p>
        </div>

        {/* Nomor register */}
        {nomor && (
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}
          >
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Nomor Register</p>
              <p className="text-lg font-black text-blue-800 tracking-wider">{nomor}</p>
            </div>
            <button
              onClick={undefined}
              title="Salin nomor"
              className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
              style={{ color: '#1565C0' }}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}

        <p className="text-xs text-slate-400 max-w-xs">
          Simpan nomor register ini untuk memantau status permohonan Anda.
        </p>

        <Link
          href="/ppid/permohonan"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105 mt-2"
          style={{ background: '#0D47A1', color: 'white' }}
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Permohonan
        </Link>
      </div>
    </div>
  )
}