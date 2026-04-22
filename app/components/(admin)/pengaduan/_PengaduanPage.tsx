'use client'
// app/(admin)/admin/pengaduan/_PengaduanPage.tsx
import { useEffect, useState, useTransition } from 'react'
import { AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd, BtnDelete, BtnPrimary, BtnSecondary, FormField, Select, Textarea, EmptyState, useToast } from '@/components/admin/AdminUI'
import { updateStatusPengaduan, deletePengaduan } from '@/actions/admin'
import { AlertTriangle } from 'lucide-react'

type Pengaduan = { id: string; nomorTiket: string; nama: string; nip: string; unitKerja: string; kategori: string; subjek: string; uraian: string; status: string; tanggapan: string | null; createdAt: string }

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  BARU:        { bg: '#EFF6FF', color: '#0D47A1' },
  DIVERIFIKASI:{ bg: '#FFFBEB', color: '#D97706' },
  DIPROSES:    { bg: '#F0FDF4', color: '#16A34A' },
  SELESAI:     { bg: '#DCFCE7', color: '#15803D' },
  DITUTUP:     { bg: '#F1F5F9', color: '#64748B' },
}

export default function PengaduanPage() {
  const [list, setList]     = useState<Pengaduan[]>([])
  const [detail, setDetail] = useState<Pengaduan | null>(null)
  const [tanggapan, setTanggapan] = useState('')
  const [status, setStatus] = useState('')
  const [pending, start]    = useTransition()
  const { show, ToastEl }   = useToast()
  function load() {
    fetch('/api/admin/pengaduan').then((r) => r.json()).then((d) => setList(d))
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/pengaduan').then((r) => r.json()).then((d) => { if (!cancelled) setList(d) })
    return () => { cancelled = true }
  }, [])

  function openDetail(p: Pengaduan) {
    setDetail(p)
    setTanggapan(p.tanggapan ?? '')
    setStatus(p.status)
  }

  function handleUpdate() {
    if (!detail) return
    start(async () => {
      await updateStatusPengaduan(detail.id, status, tanggapan)
      show('Status pengaduan diperbarui')
      setDetail(null); load()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Pengaduan (WBS)" />
        <AdminTable headers={['No. Tiket', 'Pelapor', 'Kategori', 'Subjek', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada pengaduan" /></td></tr>
            : list.map((p) => {
              const sc = STATUS_COLORS[p.status] ?? STATUS_COLORS.DITUTUP
              return (
                <AdminTr key={p.id}>
                  <AdminTd><span className="font-mono text-[10px]" style={{ color: '#64748B' }}>{p.nomorTiket}</span></AdminTd>
                  <AdminTd>
                    <p className="font-semibold" style={{ color: '#0A2342' }}>{p.nama}</p>
                    <p className="text-[10px]" style={{ color: '#94A3B8' }}>{p.unitKerja}</p>
                  </AdminTd>
                  <AdminTd>{p.kategori}</AdminTd>
                  <AdminTd><p className="line-clamp-1 max-w-xs">{p.subjek}</p></AdminTd>
                  <AdminTd>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full" style={sc}>{p.status}</span>
                  </AdminTd>
                  <AdminTd>
                    <div className="flex gap-1.5">
                      <button onClick={() => openDetail(p)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1565C0' }}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                      <BtnDelete label={`pengaduan ${p.nomorTiket}`} onConfirm={async () => { await deletePengaduan(p.id); load() }} />
                    </div>
                  </AdminTd>
                </AdminTr>
              )
            })}
        </AdminTable>
      </AdminCard>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(6,15,30,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between px-6 py-4 sticky top-0" style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}>
              <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>Detail Pengaduan — {detail.nomorTiket}</h3>
              <button onClick={() => setDetail(null)} className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: '#F1F5F9', color: '#64748B' }}>✕</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[['Nama', detail.nama], ['NIP', detail.nip], ['Unit Kerja', detail.unitKerja], ['Kategori', detail.kategori]].map(([k, v]) => (
                  <div key={k}><p className="font-black uppercase tracking-wider text-[10px]" style={{ color: '#94A3B8' }}>{k}</p><p className="font-semibold" style={{ color: '#0A2342' }}>{v}</p></div>
                ))}
              </div>
              <div className="rounded-xl p-4" style={{ background: '#F8FAFF', border: '1px solid #DBEAFE' }}>
                <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>Uraian</p>
                <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>{detail.uraian}</p>
              </div>
              <FormField label="Update Status">
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {['BARU','DIVERIFIKASI','DIPROSES','SELESAI','DITUTUP'].map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </FormField>
              <FormField label="Tanggapan">
                <Textarea value={tanggapan} onChange={(e) => setTanggapan(e.target.value)} rows={4} placeholder="Tulis tanggapan..." />
              </FormField>
              <div className="flex justify-end gap-2">
                <BtnSecondary onClick={() => setDetail(null)}>Batal</BtnSecondary>
                <BtnPrimary onClick={handleUpdate} loading={pending}>Simpan Tanggapan</BtnPrimary>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}