'use client'
// app/admin/ppid/permohonan/[id]/_PermohonanDetailPage.tsx
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AdminCard, AdminCardHeader, BtnPrimary, BtnSecondary,
  FormField, Textarea, Select, useToast,
} from '@/components/admin/AdminUI'
import { ArrowLeft } from 'lucide-react'

type StatusPermohonan = 'PENDING' | 'DIPROSES' | 'SELESAI' | 'DITOLAK'

type Permohonan = {
  id: string
  namaPemohon: string
  nik: string | null
  alamat: string | null
  telepon: string | null
  email: string | null
  pekerjaan: string | null
  informasiDiminta: string
  tujuanPenggunaan: string
  caraPenyampaian: string
  status: StatusPermohonan
  nomorRegister: string | null
  keterangan: string | null
  createdAt: string
  updatedAt: string
}

const STATUS_COLOR: Record<StatusPermohonan, { color: string; bg: string; label: string }> = {
  PENDING:  { color: '#B45309', bg: '#FFFBEB', label: 'Pending' },
  DIPROSES: { color: '#0D47A1', bg: '#EFF6FF', label: 'Diproses' },
  SELESAI:  { color: '#065F46', bg: '#ECFDF5', label: 'Selesai' },
  DITOLAK:  { color: '#DC2626', bg: '#FFF1F2', label: 'Ditolak' },
}

export default function PermohonanDetailPage({ id }: { id: string }) {
  const router                = useRouter()
  const [data, setData]       = useState<Permohonan | null>(null)
  const [loading, setLoading] = useState(true)
  const [pending, start]      = useTransition()
  const { show, ToastEl }     = useToast()

  const [editStatus, setEditStatus] = useState<StatusPermohonan>('PENDING')
  const [editKet,    setEditKet]    = useState('')
  const [editNomor,  setEditNomor]  = useState('')

  useEffect(() => {
    fetch(`/api/admin/ppid/permohonan/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setEditStatus(d.status)
        setEditKet(d.keterangan ?? '')
        setEditNomor(d.nomorRegister ?? '')
        setLoading(false)
      })
      .catch(() => { show('Gagal memuat data', 'error'); setLoading(false) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function handleUpdate() {
    start(async () => {
      try {
        await fetch('/api/admin/ppid/permohonan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            status: editStatus,
            keterangan: editKet,
            nomorRegister: editNomor,
          }),
        })
        show('Permohonan diperbarui')
        router.push('/admin/ppid/permohonan')
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm text-slate-400">Memuat data…</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3">
        <p className="text-sm text-slate-400">Data permohonan tidak ditemukan.</p>
        <BtnSecondary onClick={() => router.push('/admin/ppid/permohonan')}>
          Kembali
        </BtnSecondary>
      </div>
    )
  }

  const statusStyle = STATUS_COLOR[data.status]

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />

      {/* Back */}
      <button
        onClick={() => router.push('/admin/ppid/permohonan')}
        className="self-start inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-105"
        style={{ background: '#EFF6FF', color: '#0D47A1', border: '1px solid #DBEAFE' }}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar
      </button>

      {/* Header info */}
      <AdminCard>
        <AdminCardHeader title={`Permohonan — ${data.namaPemohon}`} />
        <div className="p-5 grid sm:grid-cols-2 gap-6">

          {/* Kolom kiri: data pemohon */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
              Data Pemohon
            </p>
            <InfoRow label="Nama"      value={data.namaPemohon} />
            <InfoRow label="NIK"       value={data.nik} />
            <InfoRow label="Alamat"    value={data.alamat} />
            <InfoRow label="Telepon"   value={data.telepon} />
            <InfoRow label="Email"     value={data.email} />
            <InfoRow label="Pekerjaan" value={data.pekerjaan} />
            <InfoRow label="Tanggal"   value={new Date(data.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} />
          </div>

          {/* Kolom kanan: detail permohonan */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
              Detail Permohonan
            </p>

            {/* Status badge */}
            <div className="flex gap-2 items-center">
              <span className="text-[10px] font-bold" style={{ color: '#94A3B8' }}>Status</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ background: statusStyle.bg, color: statusStyle.color }}
              >
                {statusStyle.label}
              </span>
              {data.nomorRegister && (
                <span className="text-xs font-mono font-bold ml-auto" style={{ color: '#0D47A1' }}>
                  {data.nomorRegister}
                </span>
              )}
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 mb-1">Cara Penyampaian</p>
              <p className="text-xs text-slate-700 capitalize">{data.caraPenyampaian}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 mb-1">Informasi yang Diminta</p>
              <p className="text-xs text-slate-700 leading-relaxed">{data.informasiDiminta}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 mb-1">Tujuan Penggunaan</p>
              <p className="text-xs text-slate-700 leading-relaxed">{data.tujuanPenggunaan}</p>
            </div>
            {data.keterangan && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1">Keterangan</p>
                <p className="text-xs text-slate-700 leading-relaxed">{data.keterangan}</p>
              </div>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Tindak lanjut */}
      <AdminCard>
        <AdminCardHeader title="Tindak Lanjut" />
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          <FormField label="Nomor Register">
            <input
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none font-mono"
              value={editNomor}
              onChange={(e) => setEditNomor(e.target.value)}
              placeholder="PPID/2025/001"
            />
          </FormField>
          <FormField label="Ubah Status">
            <Select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as StatusPermohonan)}
            >
              <option value="PENDING">Pending</option>
              <option value="DIPROSES">Diproses</option>
              <option value="SELESAI">Selesai</option>
              <option value="DITOLAK">Ditolak</option>
            </Select>
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Keterangan / Catatan untuk Pemohon">
              <Textarea
                rows={4}
                value={editKet}
                onChange={(e) => setEditKet(e.target.value)}
                placeholder="Tulis keterangan atau catatan tindak lanjut…"
              />
            </FormField>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
          <BtnSecondary onClick={() => router.push('/admin/ppid/permohonan')}>Batal</BtnSecondary>
          <BtnPrimary onClick={handleUpdate} loading={pending}>Simpan Perubahan</BtnPrimary>
        </div>
      </AdminCard>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-2">
      <span className="text-[10px] font-bold w-20 shrink-0 pt-0.5" style={{ color: '#94A3B8' }}>{label}</span>
      <span className="text-xs text-slate-700">{value ?? '-'}</span>
    </div>
  )
}