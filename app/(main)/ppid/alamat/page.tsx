// app/(public)/ppid/alamat/page.tsx
import { prisma }        from '@/lib/prisma'
import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kedudukan dan Alamat PPID',
}

export default async function AlamatPPIDPage() {
  const kontakList = await prisma.informasiKontak.findMany({
    orderBy: { urutan: 'asc' },
  })

  const ikonMap: Record<string, React.ReactNode> = {
    alamat:    <MapPin  className="w-5 h-5" />,
    telepon:   <Phone   className="w-5 h-5" />,
    email:     <Mail    className="w-5 h-5" />,
    jam_kerja: <Clock   className="w-5 h-5" />,
  }

  const colorMap: Record<string, { color: string; bg: string }> = {
    alamat:    { color: '#0D47A1', bg: '#EFF6FF' },
    telepon:   { color: '#065F46', bg: '#ECFDF5' },
    email:     { color: '#7C3AED', bg: '#F5F3FF' },
    jam_kerja: { color: '#B45309', bg: '#FFFBEB' },
  }

  // Fallback kontak jika DB kosong
  const defaultKontak = [
    { id: '1', tipe: 'alamat',    nama: 'Alamat Kantor', nilai: 'Jl. El Tari No. 1, Kupang, Nusa Tenggara Timur 85111' },
    { id: '2', tipe: 'telepon',   nama: 'Telepon',       nilai: '(0380) 833-xxx' },
    { id: '3', tipe: 'email',     nama: 'Email',         nilai: 'biroorganisasi@nttprov.go.id' },
    { id: '4', tipe: 'jam_kerja', nama: 'Jam Pelayanan', nilai: 'Senin – Jumat: 08.00 – 16.00 WITA' },
  ]

  const displayKontak = kontakList.length > 0 ? kontakList : defaultKontak

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Kedudukan dan Alamat PPID
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Informasi lokasi dan kontak Pejabat Pengelola Informasi dan Dokumentasi Biro Organisasi Setda Provinsi NTT.
        </p>
      </div>

      {/* ── Kontak cards ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {displayKontak.map((k) => {
          const style = colorMap[k.tipe] ?? { color: '#0D47A1', bg: '#EFF6FF' }
          return (
            <div
              key={k.id}
              className="rounded-2xl p-5 flex items-start gap-4"
              style={{ background: style.bg, border: `1px solid ${style.color}20` }}
            >
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{ background: style.color, color: 'white' }}
              >
                {ikonMap[k.tipe] ?? <MapPin className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: `${style.color}80` }}>
                  {k.nama}
                </p>
                <p className="text-sm font-semibold leading-snug" style={{ color: style.color }}>
                  {k.nilai}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Maps embed ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'white', border: '1px solid #DBEAFE' }}
      >
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #DBEAFE' }}>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700">Lokasi Kantor</span>
          </div>
          <a
            href="https://maps.google.com/?q=Biro+Organisasi+Setda+NTT+Kupang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-800"
          >
            Buka di Google Maps <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="relative w-full" style={{ height: '280px', background: '#EFF6FF' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.55!2d123.5784!3d-10.1771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDEwJzM3LjYiUyAxMjPCsDM0JzQyLjIiRQ!5e0!3m2!1sid!2sid!4v1"
            width="100%"
            height="280"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Biro Organisasi Setda NTT"
          />
        </div>
      </div>

      {/* ── Jam pelayanan detail ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Jam Pelayanan PPID</h2>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { hari: 'Senin – Kamis', jam: '08.00 – 16.00 WITA', aktif: true },
            { hari: 'Jumat',         jam: '08.00 – 16.30 WITA', aktif: true },
            { hari: 'Sabtu & Minggu', jam: 'Tutup',              aktif: false },
          ].map((j, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{
                background: j.aktif ? '#EFF6FF' : '#F8FAFC',
                border: `1px solid ${j.aktif ? '#DBEAFE' : '#E2E8F0'}`,
              }}
            >
              <span className="text-sm font-medium" style={{ color: j.aktif ? '#1E3A5F' : '#94A3B8' }}>
                {j.hari}
              </span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{
                  background: j.aktif ? '#0D47A1' : '#E2E8F0',
                  color:      j.aktif ? 'white'   : '#94A3B8',
                }}
              >
                {j.jam}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}