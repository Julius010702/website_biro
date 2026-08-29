'use client'
// app/components/(admin)/ppid/keberatan/_KeberatanPage.tsx
import { useCallback, useEffect, useState, useTransition } from 'react'

import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnPrimary, BtnSecondary, FormField, Textarea, Select,
  EmptyState, useToast,
} from '@/components/admin/AdminUI'

type StatusPermohonan = 'PENDING' | 'DIPROSES' | 'SELESAI' | 'DITOLAK'

type Keberatan = {
  id: string
  nomorTiket: string | null
  nomorPendaftaran: string
  tujuanPenggunaan: string
  namaLengkap: string
  alamat: string | null
  pekerjaan: string | null
  email: string
  telepon: string
  kuasaNama: string | null
  kuasaAlamat: string | null
  kuasaTelepon: string | null
  alasanA: boolean
  alasanB: boolean
  alasanC: boolean
  alasanD: boolean
  alasanE: boolean
  alasanF: boolean
  alasanG: boolean
  kasusPosisi: string
  tandaTangan: string
  status: StatusPermohonan
  keterangan: string | null
  createdAt: string
}

const STATUS_COLOR: Record<StatusPermohonan, { color: string; bg: string; label: string }> = {
  PENDING:  { color: '#B45309', bg: '#FFFBEB', label: 'Pending' },
  DIPROSES: { color: '#0D47A1', bg: '#EFF6FF', label: 'Diproses' },
  SELESAI:  { color: '#065F46', bg: '#ECFDF5', label: 'Selesai' },
  DITOLAK:  { color: '#DC2626', bg: '#FFF1F2', label: 'Ditolak' },
}

const ALASAN_LABEL: Record<string, string> = {
  alasanA: 'a. Permohonan Informasi di tolak',
  alasanB: 'b. Informasi berkala tidak disediakan',
  alasanC: 'c. Permintaan informasi tidak ditanggapi',
  alasanD: 'd. Permintaan informasi ditanggapi tidak sebagaimana yang diminta',
  alasanE: 'e. Permintaan informasi tidak dipenuhi',
  alasanF: 'f. Biaya yang dikenakan tidak wajar',
  alasanG: 'g. Informasi disampaikan melebihi jangka waktu yang ditentukan',
}

export default function KeberatanPage() {
  const [list, setList]       = useState<Keberatan[]>([])
  const [detail, setDetail]   = useState<Keberatan | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [pending, start]      = useTransition()
  const { show, ToastEl }     = useToast()

  const [editStatus, setEditStatus] = useState<StatusPermohonan>('PENDING')
  const [editKet, setEditKet]       = useState('')

  const load = useCallback(() => {
    const qs = filterStatus ? `?status=${filterStatus}` : ''
    fetch(`/api/admin/ppid/keberatan${qs}`).then((r) => r.json()).then(setList)
  }, [filterStatus])

  useEffect(() => { load() }, [load])

  function openDetail(d: Keberatan) {
    setDetail(d)
    setEditStatus(d.status)
    setEditKet(d.keterangan ?? '')
  }

  function handleUpdate() {
    if (!detail) return
    start(async () => {
      try {
        await fetch('/api/admin/ppid/keberatan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: detail.id,
            status: editStatus,
            keterangan: editKet,
          }),
        })
        show('Status keberatan diperbarui')
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

  const alasanTerpilih = (d: Keberatan) =>
    (Object.keys(ALASAN_LABEL) as (keyof typeof ALASAN_LABEL)[]).filter((k) => d[k as keyof Keberatan])

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
        <AdminCardHeader title="Pengajuan Keberatan" />
        <AdminTable headers={['No. Tiket', 'Pemohon', 'No. Pendaftaran', 'Tanggal', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada pengajuan keberatan" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <span className="text-xs font-mono font-bold" style={{ color: '#0D47A1' }}>
                    {d.nomorTiket ?? '-'}
                  </span>
                </AdminTd>
                <AdminTd>
                  <p className="font-semibold text-sm" style={{ color: '#0A2342' }}>{d.namaLengkap}</p>
                  <p className="text-[11px] text-slate-400">{d.email}</p>
                </AdminTd>
                <AdminTd>
                  <span className="text-xs text-slate-600 font-mono">{d.nomorPendaftaran}</span>
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
          <AdminCardHeader title={`Kelola Keberatan — ${detail.namaLengkap}`} />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Informasi Pengaju</p>
              <InfoRow label="No. Pendaftaran" value={detail.nomorPendaftaran} />
              <InfoRow label="Tujuan"           value={detail.tujuanPenggunaan} />
              <p className="text-xs font-bold uppercase tracking-wider mt-2" style={{ color: '#94A3B8' }}>Identitas Pemohon</p>
              <InfoRow label="Nama"     value={detail.namaLengkap} />
              <InfoRow label="Email"    value={detail.email} />
              <InfoRow label="Telepon"  value={detail.telepon} />
              <InfoRow label="Alamat"   value={detail.alamat} />
              <InfoRow label="Pekerjaan" value={detail.pekerjaan} />
              {(detail.kuasaNama || detail.kuasaTelepon || detail.kuasaAlamat) && (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider mt-2" style={{ color: '#94A3B8' }}>Kuasa Pemohon</p>
                  <InfoRow label="Nama"    value={detail.kuasaNama} />
                  <InfoRow label="Telepon" value={detail.kuasaTelepon} />
                  <InfoRow label="Alamat"  value={detail.kuasaAlamat} />
                </>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Alasan Keberatan</p>
              <ul className="flex flex-col gap-1">
                {alasanTerpilih(detail).map((k) => (
                  <li key={k} className="text-xs text-slate-700 leading-relaxed">• {ALASAN_LABEL[k]}</li>
                ))}
              </ul>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">Kasus Posisi</p>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{detail.kasusPosisi}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1">Tanda Tangan</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detail.tandaTangan}
                  alt="Tanda tangan pemohon"
                  className="rounded-lg border border-slate-200 bg-white"
                  style={{ maxWidth: '260px' }}
                />
              </div>
            </div>

            <div className="sm:col-span-2 pt-4" style={{ borderTop: '1px solid #EEF3FC' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#94A3B8' }}>Tindak Lanjut</p>
              <div className="grid sm:grid-cols-2 gap-4">
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
      <span className="text-[10px] font-bold w-24 shrink-0 pt-0.5" style={{ color: '#94A3B8' }}>{label}</span>
      <span className="text-xs text-slate-700">{value ?? '-'}</span>
    </div>
  )
}