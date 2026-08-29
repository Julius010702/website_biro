import type { Metadata } from "next"
import { submitKeberatan } from "@/actions/ppid"
import { AlertCircle, CheckCircle } from "lucide-react"
import KeberatanTandaTangan from "@/components/ppid/KeberatanTandaTangan"
import KeberatanSubmitButton from "@/components/ppid/KeberatanSubmitButton"

export const metadata: Metadata = {
  title: "Pengajuan Keberatan",
  description: "Formulir Pernyataan Keberatan atas Permohonan Informasi PPID Biro Organisasi Setda Provinsi NTT",
}

const alasanList = [
  { id: "alasanA", label: "Permohonan Informasi di tolak" },
  { id: "alasanB", label: "Informasi berkala tidak disediakan" },
  { id: "alasanC", label: "Permintaan informasi tidak ditanggapi" },
  { id: "alasanD", label: "Permintaan informasi ditanggapi tidak sebagaimana yang diminta" },
  { id: "alasanE", label: "Permintaan informasi tidak dipenuhi" },
  { id: "alasanF", label: "Biaya yang dikenakan tidak wajar" },
  { id: "alasanG", label: "Informasi disampaikan melebihi jangka waktu yang ditentukan" },
]

export default async function KeberatanPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; ref?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid #DBEAFE" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: "#0A2342", fontFamily: "var(--font-heading)" }}>
            Pernyataan Keberatan atas Permohonan Informasi
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Ajukan keberatan atas permohonan informasi publik yang sudah pernah Anda daftarkan sebelumnya.
        </p>
      </div>

      {/* Success banner */}
      {params.success === "1" && params.ref && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: "#ECFDF5", border: "1px solid #6EE7B7" }}
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Keberatan berhasil dikirim.</p>
            <p className="text-xs text-emerald-700">
              Nomor tiket Anda: <span className="font-mono font-semibold">{params.ref}</span>. Simpan nomor ini untuk keperluan komunikasi selanjutnya.
            </p>
          </div>
        </div>
      )}

      {/* Formulir */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: "white", border: "1px solid #DBEAFE" }}>
        <form action={submitKeberatan} className="flex flex-col gap-6">

          {/* A. Informasi Pengaju Keberatan */}
          <fieldset>
            <legend className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 pb-2 w-full" style={{ borderBottom: "1px solid #DBEAFE" }}>
              A. Informasi Pengaju Keberatan
            </legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Nomor Pendaftaran Permohonan Informasi *" name="nomorPendaftaran" required />
              <TextField label="Tujuan Penggunaan Informasi *" name="tujuanPenggunaan" required />
            </div>
          </fieldset>

          {/* Identitas Pemohon */}
          <fieldset>
            <legend className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 pb-2 w-full" style={{ borderBottom: "1px solid #DBEAFE" }}>
              Identitas Pemohon
            </legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Nama Lengkap *" name="namaLengkap" required />
              <TextField label="Email *" name="email" type="email" required />
              <TextField label="No. Telepon/HP *" name="telepon" type="tel" required />
              <TextField label="Pekerjaan" name="pekerjaan" />
              <div className="sm:col-span-2">
                <TextAreaField label="Alamat" name="alamat" rows={3} />
              </div>
            </div>
          </fieldset>

          {/* Identitas Kuasa Pemohon */}
          <fieldset>
            <legend className="mb-3 pb-2 w-full" style={{ borderBottom: "1px solid #DBEAFE" }}>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Identitas Kuasa Pemohon</span>
              <span className="block text-[10px] font-normal text-slate-400 normal-case mt-0.5">
                (Diisi jika ada kuasa pemohonnya dan melampirkan Surat Kuasa)
              </span>
            </legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Nama Lengkap" name="kuasaNama" />
              <TextField label="No. Telepon/HP" name="kuasaTelepon" type="tel" />
              <div className="sm:col-span-2">
                <TextAreaField label="Alamat" name="kuasaAlamat" rows={3} />
              </div>
            </div>
          </fieldset>

          {/* B. Alasan Pengajuan Keberatan */}
          <fieldset>
            <legend className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 pb-2 w-full" style={{ borderBottom: "1px solid #DBEAFE" }}>
              B. Alasan Pengajuan Keberatan *
            </legend>
            <div className="grid sm:grid-cols-2 gap-3">
              {alasanList.map((a) => (
                <label
                  key={a.id}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <input type="checkbox" name={a.id} className="mt-0.5 w-3.5 h-3.5 accent-blue-700" />
                  <span className="text-xs text-slate-700 leading-relaxed">{a.label}</span>
                </label>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3">
              (Sesuai dengan Pasal 35 UU KIP, dipilih oleh pengaju keberatan sesuai dengan alasan keberatan yang diajukan)
            </p>
          </fieldset>

          {/* C. Kasus Posisi */}
          <fieldset>
            <legend className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 pb-2 w-full" style={{ borderBottom: "1px solid #DBEAFE" }}>
              C. Kasus Posisi
            </legend>
            <TextAreaField label="Uraikan kasus posisi keberatan Anda *" name="kasusPosisi" rows={5} required hideLabel />
          </fieldset>

          {/* D. Tanggapan & Tanda Tangan */}
          <fieldset>
            <legend className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 pb-2 w-full" style={{ borderBottom: "1px solid #DBEAFE" }}>
              D. Hari/Tanggal Tanggapan atas Keberatan akan Diberikan
            </legend>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Tanggapan atas keberatan pemohon informasi publik akan disampaikan dalam jangka waktu paling lambat{" "}
              <span className="font-semibold text-slate-700">30 (tiga puluh) hari kerja</span> sejak diterimanya keberatan.
              Demikian keberatan ini saya sampaikan, atas perhatian dan tanggapannya, saya ucapkan terima kasih.
            </p>
            <KeberatanTandaTangan />
          </fieldset>

          {/* Notice */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: "#FFFBEB", border: "1px solid #FCD34D" }}
          >
            <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700 leading-relaxed">
              Pastikan Anda sudah menandatangani form ini sebelum mengirim.
            </p>
          </div>

          <KeberatanSubmitButton />
        </form>
      </div>
    </div>
  )
}

// ─── Helper field components ────────────────────────────────────────────────
function TextField({
  label, name, type = "text", required,
}: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        style={{ color: "#1E3A5F" }}
      />
    </div>
  )
}

function TextAreaField({
  label, name, rows = 3, required, hideLabel,
}: { label: string; name: string; rows?: number; required?: boolean; hideLabel?: boolean }) {
  return (
    <div>
      {!hideLabel && <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>}
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={hideLabel ? label : undefined}
        className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
        style={{ color: "#1E3A5F" }}
      />
    </div>
  )
}