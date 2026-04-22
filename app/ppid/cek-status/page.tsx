// app/(public)/ppid/cek-status/page.tsx
'use client'

import PageHeader from '@/components/ui/PageHeader'
import { useState } from 'react'
import { Search } from 'lucide-react'

type StatusResult = {
  nomor: string
  subjek: string
  tanggal: string
  status: 'Diproses' | 'Selesai' | 'Ditolak'
  keterangan: string
}

const dummyData: StatusResult[] = [
  {
    nomor: 'PPID/2024/001',
    subjek: 'Data OPD Provinsi NTT',
    tanggal: '10 Januari 2024',
    status: 'Selesai',
    keterangan: 'Informasi telah tersedia dan dapat diambil.',
  },
  {
    nomor: 'PPID/2024/002',
    subjek: 'Laporan Keuangan 2023',
    tanggal: '15 Januari 2024',
    status: 'Diproses',
    keterangan: 'Sedang dalam proses verifikasi dokumen.',
  },
]

const statusColor: Record<string, string> = {
  Selesai:  'var(--color-ntt-gold-600)',
  Diproses: 'var(--color-ntt-red-700)',
  Ditolak:  '#dc2626',
}

export default function CekStatusPage() {
  const [nomor, setNomor]     = useState('')
  const [result, setResult]   = useState<StatusResult | null | undefined>(undefined)

  function handleCek(e: React.FormEvent) {
    e.preventDefault()
    const found = dummyData.find((d) => d.nomor.toLowerCase() === nomor.trim().toLowerCase())
    setResult(found ?? null)
  }

  return (
    <>
      <PageHeader
        title="Cek Status Permohonan"
        subtitle="Pantau perkembangan permohonan informasi Anda"
        breadcrumbs={[{ label: 'PPID', href: '/ppid' }, { label: 'Cek Status' }]}
      />
      <div className="max-w-xl mx-auto px-4 py-10">
        <form onSubmit={handleCek} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Nomor Registrasi Permohonan
            </label>
            <input
              type="text"
              value={nomor}
              onChange={(e) => setNomor(e.target.value)}
              placeholder="Contoh: PPID/2024/001"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ backgroundColor: 'var(--color-ntt-red-700)' }}>
            <Search className="w-4 h-4" /> Cek Status
          </button>
        </form>

        {result === null && (
          <div className="mt-6 bg-white rounded-2xl shadow-card p-6 text-center text-sm text-gray-500">
            Nomor registrasi tidak ditemukan. Pastikan nomor yang Anda masukkan sudah benar.
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white rounded-2xl shadow-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nomor</span>
              <span className="text-sm font-semibold text-gray-800">{result.nomor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subjek</span>
              <span className="text-sm text-gray-700">{result.subjek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tanggal</span>
              <span className="text-sm text-gray-700">{result.tanggal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
              <span className="text-sm font-bold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: statusColor[result.status] }}>
                {result.status}
              </span>
            </div>
            <div className="w-full h-px" style={{ backgroundColor: 'var(--color-ntt-red-100)' }} />
            <p className="text-sm text-gray-600">{result.keterangan}</p>
          </div>
        )}
      </div>
    </>
  )
}