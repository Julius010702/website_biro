// app/(public)/ppid/permohonan/page.tsx
import type { Metadata } from 'next'
import { submitPermohonan } from '@/actions/ppid'
import {
  MessageSquare, Clock, CheckCircle,
  AlertCircle, FileText, ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Permohonan Informasi',
  description: 'Formulir Permohonan Informasi Publik PPID Biro Organisasi Setda Provinsi NTT',
}

const alurList = [
  { step: '01', label: 'Isi Formulir',   desc: 'Lengkapi data diri dan informasi yang dimohon',      icon: <FileText       className="w-4 h-4" /> },
  { step: '02', label: 'Verifikasi',      desc: 'PPID memverifikasi dan mencatat permohonan',         icon: <CheckCircle    className="w-4 h-4" /> },
  { step: '03', label: 'Proses',          desc: 'Informasi diproses maksimal 10 hari kerja',          icon: <Clock          className="w-4 h-4" /> },
  { step: '04', label: 'Pemberitahuan',   desc: 'Pemohon diberitahu tentang ketersediaan informasi',  icon: <AlertCircle    className="w-4 h-4" /> },
]

export default function PermohonanInformasiPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>
            Permohonan Informasi Online
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Ajukan permohonan informasi publik secara online. Permohonan akan diproses dalam 10 hari kerja.
        </p>
      </div>

      {/* ── Alur permohonan ── */}
      <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-sm font-bold" style={{ color: '#0A2342' }}>Alur Permohonan</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {alurList.map((a, i) => (
            <div key={i} className="relative">
              <div
                className="rounded-xl p-3 text-center h-full"
                style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}
              >
                <div className="flex justify-center mb-2" style={{ color: '#0D47A1' }}>{a.icon}</div>
                <div className="text-[10px] font-black text-blue-300 mb-0.5">{a.step}</div>
                <div className="text-xs font-bold text-blue-800 mb-1">{a.label}</div>
                <div className="text-[10px] text-slate-500 leading-snug">{a.desc}</div>
              </div>
              {i < alurList.length - 1 && (
                <ChevronRight className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Formulir ── */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'white', border: '1px solid #DBEAFE' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h2 className="text-base font-bold" style={{ color: '#0A2342' }}>Formulir Permohonan</h2>
        </div>

        <form action={submitPermohonan} className="flex flex-col gap-5">

          {/* Data Pemohon */}
          <fieldset>
            <legend className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 pb-2 w-full" style={{ borderBottom: '1px solid #DBEAFE' }}>
              Data Pemohon
            </legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Nama Lengkap *" name="namaPemohon" type="text" placeholder="Masukkan nama lengkap" required />
              <FormField label="NIK" name="nik" type="text" placeholder="Nomor Induk Kependudukan" />
              <FormField label="Nomor Telepon" name="telepon" type="tel" placeholder="08xx-xxxx-xxxx" />
              <FormField label="Email" name="email" type="email" placeholder="nama@email.com" />
              <div className="sm:col-span-2">
                <FormField label="Alamat" name="alamat" type="text" placeholder="Alamat lengkap pemohon" />
              </div>
              <FormField label="Pekerjaan" name="pekerjaan" type="text" placeholder="Pekerjaan/profesi" />
            </div>
          </fieldset>

          {/* Informasi yang diminta */}
          <fieldset>
            <legend className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 pb-2 w-full" style={{ borderBottom: '1px solid #DBEAFE' }}>
              Informasi yang Dimohon
            </legend>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Informasi yang Diminta <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="informasiDiminta"
                  required
                  rows={4}
                  placeholder="Jelaskan secara rinci informasi yang Anda butuhkan..."
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  style={{ color: '#1E3A5F' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tujuan Penggunaan Informasi <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="tujuanPenggunaan"
                  required
                  rows={3}
                  placeholder="Jelaskan untuk keperluan apa informasi ini dibutuhkan..."
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  style={{ color: '#1E3A5F' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cara Penyampaian <span className="text-red-500">*</span>
                </label>
                <select
                  name="caraPenyampaian"
                  required
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  style={{ color: '#1E3A5F' }}
                >
                  <option value="">-- Pilih cara penyampaian --</option>
                  <option value="email">Email</option>
                  <option value="langsung">Langsung (datang ke kantor)</option>
                  <option value="pos">Pos/Surat</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Notice */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}
          >
            <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700 leading-relaxed">
              Dengan mengajukan permohonan ini, Anda menyatakan bahwa informasi yang diberikan adalah benar dan akurat. PPID akan menghubungi Anda dalam waktu 10 hari kerja.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            style={{ background: '#0D47A1', color: 'white', boxShadow: '0 4px 16px rgba(13,71,161,0.25)' }}
          >
            <MessageSquare className="w-4 h-4" />
            Kirim Permohonan
          </button>
        </form>
      </div>

      {/* ── Cek status ── */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}
      >
        <CheckCircle className="w-8 h-8 text-blue-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-blue-800 mb-0.5">Sudah mengajukan permohonan?</p>
          <p className="text-xs text-blue-600">Simpan nomor register Anda untuk cek status permohonan.</p>
        </div>
      </div>
    </div>
  )
}

// ─── Helper field component ───────────────────────────────────────────────────
function FormField({
  label, name, type, placeholder, required,
}: {
  label: string; name: string; type: string; placeholder: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        style={{ color: '#1E3A5F' }}
      />
    </div>
  )
}