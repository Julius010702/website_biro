'use client'
// app/(admin)/admin/kontak/_KontakPage.tsx
import { useEffect, useState, useTransition } from 'react'
import { AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd, BtnDelete, EmptyState, useToast } from '@/components/admin/AdminUI'
import { tandaiDibacaKontak, deleteKontak } from '@/actions/admin'
import { Mail, MailOpen } from 'lucide-react'

type Kontak = { id: string; nama: string; email: string; telepon: string | null; subjek: string; pesan: string; dibaca: boolean; createdAt: string }

export default function KontakPage() {
  const [list, setList] = useState<Kontak[]>([])
  const [detail, setDetail] = useState<Kontak | null>(null)
  const [, start] = useTransition()
  const { ToastEl } = useToast()
  function load() {
    fetch('/api/admin/kontak').then((r) => r.json()).then((d) => setList(d))
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/kontak').then((r) => r.json()).then((d) => { if (!cancelled) setList(d) })
    return () => { cancelled = true }
  }, [])

  function openDetail(k: Kontak) {
    setDetail(k)
    if (!k.dibaca) {
      start(async () => { await tandaiDibacaKontak(k.id); load() })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Pesan Kontak Masuk" />
        <AdminTable headers={['Pengirim', 'Subjek', 'Tanggal', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={5}><EmptyState label="Belum ada pesan masuk" /></td></tr>
            : list.map((k) => (
              <AdminTr key={k.id}>
                <AdminTd>
                  <p className="font-semibold" style={{ color: '#0A2342' }}>{k.nama}</p>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>{k.email}</p>
                </AdminTd>
                <AdminTd>
                  <button onClick={() => openDetail(k)} className="text-left text-xs font-semibold hover:text-blue-700 transition-colors line-clamp-1" style={{ color: '#1565C0' }}>
                    {k.subjek}
                  </button>
                </AdminTd>
                <AdminTd>{new Date(k.createdAt).toLocaleDateString('id-ID')}</AdminTd>
                <AdminTd>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: k.dibaca ? '#F1F5F9' : '#EFF6FF', color: k.dibaca ? '#94A3B8' : '#0D47A1' }}>
                    {k.dibaca ? <><MailOpen className="w-3 h-3" /> Dibaca</> : <><Mail className="w-3 h-3" /> Baru</>}
                  </span>
                </AdminTd>
                <AdminTd>
                  <BtnDelete label={`pesan dari ${k.nama}`} onConfirm={async () => { await deleteKontak(k.id); load() }} />
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(6,15,30,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl max-w-lg w-full" style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}>
              <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>{detail.subjek}</h3>
              <button onClick={() => setDetail(null)} className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: '#F1F5F9', color: '#64748B' }}>✕ Tutup</button>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="font-black uppercase tracking-wider text-[10px]" style={{ color: '#94A3B8' }}>Nama</p><p className="font-semibold" style={{ color: '#0A2342' }}>{detail.nama}</p></div>
                <div><p className="font-black uppercase tracking-wider text-[10px]" style={{ color: '#94A3B8' }}>Email</p><p className="font-semibold" style={{ color: '#0A2342' }}>{detail.email}</p></div>
                {detail.telepon && <div><p className="font-black uppercase tracking-wider text-[10px]" style={{ color: '#94A3B8' }}>Telepon</p><p className="font-semibold" style={{ color: '#0A2342' }}>{detail.telepon}</p></div>}
                <div><p className="font-black uppercase tracking-wider text-[10px]" style={{ color: '#94A3B8' }}>Tanggal</p><p className="font-semibold" style={{ color: '#0A2342' }}>{new Date(detail.createdAt).toLocaleString('id-ID')}</p></div>
              </div>
              <div className="rounded-xl p-4" style={{ background: '#F8FAFF', border: '1px solid #DBEAFE' }}>
                <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>{detail.pesan}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}