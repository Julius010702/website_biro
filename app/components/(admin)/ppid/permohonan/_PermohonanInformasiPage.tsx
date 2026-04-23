'use client'
// app/components/(admin)/ppid/permohonan/_PermohonanInformasiPage.tsx
import { useCallback, useEffect, useState, useTransition } from 'react'

import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnPrimary, BtnSecondary, FormField, Textarea, Select,
  EmptyState, useToast,
} from '@/components/admin/AdminUI'

type StatusPermohonan = 'PENDING' | 'DIPROSES' | 'SELESAI' | 'DITOLAK'

type Permohonan = {
  id: string
  namaPemohon: string
  nik: string | null
  telepon: string | null
  email: string | null
  informasiDiminta: string
  tujuanPenggunaan: string
  caraPenyampaian: string
  status: StatusPermohonan
  nomorRegister: string | null
  keterangan: string | null
  createdAt: string
}

const STATUS_COLOR: Record<StatusPermohonan, { color: string; bg: string; label: string }> = {
  PENDING:  { color: '#B45309', bg: '#FFFBEB', label: 'Pending' },
  DIPROSES: { color: '#0D47A1', bg: '#EFF6FF', label: 'Diproses' },
  SELESAI:  { color: '#065F46', bg: '#ECFDF5', label: 'Selesai' },
  DITOLAK:  { color: '#DC2626', bg: '#FFF1F2', label: 'Ditolak' },
}

export default function PermohonanInformasiPage() {
  const [list, setList]       = useState<Permohonan[]>([])
  const [detail, setDetail]   = useState<Permohonan | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [pending, start]      = useTransition()
  const { show, ToastEl }     = useToast()

  const [editStatus, setEditStatus] = useState<StatusPermohonan>('PENDING')
  const [editKet, setEditKet]       = useState('')
  const [editNomor, setEditNomor]   = useState('')

  const load = useCallback(() => {
    const qs = filterStatus ? `?status=${filterStatus}` : ''
    fetch(`/api/admin/ppid/permohonan${qs}`).then((r) => r.json()).then(setList)
  }, [filterStatus])

  useEffect(() => { load() }, [load])

  function openDetail(p: Permohonan) {
    setDetail(p)
    setEditStatus(p.status)
    setEditKet(p.keterangan ?? '')
    setEditNomor(p.nomorRegister ?? '')
  }

  function handleUpdate() {
    if (!detail) return
    start(async () => {
      try {
        await fetch('/api/admin/ppid/permohonan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: detail.id,
            status: editStatus,
            keterangan: editKet,
            nomorRegister: editNomor,
          }),
        })
        show('Status permohonan diperbarui')
        setDetail(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  const badge = (s: StatusPermohonan) => {
    const c = STATUS_COLOR[s]
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: c.bg, color: c.color }}>
        {c.label}
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />

      {/* Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        {(['', 'PENDING', 'DIPROSES', 'SELESAI', 'DITOLAK'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
            style={{
              background: filterStatus === s ? '#0D47A1' : '#EFF6FF',
              color:      filterStatus === s ? 'white'   : '#1565C0',
              border: '1px solid #DBEAFE',
            }}
          >
            {s === '' ? 'Semua' : STATUS_COLOR[s as StatusPermohonan].label}
          </button>
        ))}
      </div>

      <AdminCard>
        <AdminCardHeader title="Permohonan Informasi Publik" />
        <AdminTable headers={['No. Register', 'Pemohon', 'Informasi Diminta', 'Tanggal', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada permohonan informasi" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <span className="text-xs font-mono font-bold" style={{ color: '#0D47A1' }}>
                    {d.nomorRegister ?? '-'}
                  </span>
                </AdminTd>
                <AdminTd>
                  <p className="font-semibold text-sm" style={{ color: '#0A2342' }}>{d.namaPemohon}</p>
                  {d.email && <p className="text-[11px] text-slate-400">{d.email}</p>}
                </AdminTd>
                <AdminTd>
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-xs">{d.informasiDiminta}</p>
                </AdminTd>
                <AdminTd>
                  <span className="text-xs text-slate-500">
                    {new Date(d.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </AdminTd>
                <AdminTd>{badge(d.status)}</AdminTd>
                <AdminTd>
                  <button
                    onClick={() => openDetail(d)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                    style={{ background: '#EFF6FF', color: '#0D47A1', border: '1px solid #DBEAFE' }}
                  >
                    Kelola
                  </button>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {detail !== null && (
        <AdminCard>
          <AdminCardHeader title={`Kelola Permohonan — ${detail.namaPemohon}`} />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Data Pemohon</p>
              <InfoRow label="Nama"        value={detail.namaPemohon} />
              <InfoRow label="NIK"         value={detail.nik} />
              <InfoRow label="Telepon"     value={detail.telepon} />
              <InfoRow label="Email"       value={detail.email} />
              <InfoRow label="Cara Kirim"  value={detail.caraPenyampaian} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Detail Permohonan</p>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">Informasi yang Diminta</p>
                <p className="text-xs text-slate-700 leading-relaxed">{detail.informasiDiminta}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">Tujuan Penggunaan</p>
                <p className="text-xs text-slate-700 leading-relaxed">{detail.tujuanPenggunaan}</p>
              </div>
            </div>

            <div className="sm:col-span-2 pt-4" style={{ borderTop: '1px solid #EEF3FC' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#94A3B8' }}>Tindak Lanjut</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Nomor Register">
                  <input
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none font-mono"
                    value={editNomor}
                    onChange={(e) => setEditNomor(e.target.value)}
                    placeholder="PPID/2025/001"
                  />
                </FormField>
                <FormField label="Ubah Status">
                  <Select value={editStatus} onChange={(e) => setEditStatus(e.target.value as StatusPermohonan)}>
                    <option value="PENDING">Pending</option>
                    <option value="DIPROSES">Diproses</option>
                    <option value="SELESAI">Selesai</option>
                    <option value="DITOLAK">Ditolak</option>
                  </Select>
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Keterangan / Catatan">
                    <Textarea rows={3} value={editKet} onChange={(e) => setEditKet(e.target.value)} placeholder="Catatan untuk pemohon…" />
                  </FormField>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
            <BtnSecondary onClick={() => setDetail(null)}>Tutup</BtnSecondary>
            <BtnPrimary onClick={handleUpdate} loading={pending}>Simpan Perubahan</BtnPrimary>
          </div>
        </AdminCard>
      )}
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