'use client'
// app/admin/serta-merta/page.tsx
import { useEffect, useState, useTransition } from 'react'
import { useUploadThing } from '@/lib/uploadthing-client'
import Image from 'next/image'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'

type SertaMerta = {
  id: string
  judul: string
  deskripsi: string | null
  file: string | null
  gambar: string | null
  tipe: string
  urlSosmed: string | null
  aktif: boolean
  urutan: number
}

function UploadField({ label, value, onChange, accept, hint }: {
  label: string; value: string; onChange: (url: string) => void
  accept: string; hint: string
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const isImage = accept.includes('image')

  const { startUpload } = useUploadThing(isImage ? 'imageUploader' : 'pdfUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) onChange(res[0].ufsUrl)
      setBusy(false)
    },
    onUploadError: (e) => { setErr(e.message ?? 'Upload gagal'); setBusy(false) },
  })

  return (
    <FormField label={label} hint={hint}>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Input value={value} onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau upload file" className="flex-1" />
          <label className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer"
            style={{ background: busy ? '#F3F4F6' : '#EFF6FF', color: busy ? '#9CA3AF' : '#1565C0', borderColor: busy ? '#E5E7EB' : '#BFDBFE', pointerEvents: busy ? 'none' : 'auto' }}>
            {busy ? '⏳ Mengupload...' : '📁 Upload'}
            <input type="file" accept={accept} className="hidden" disabled={busy}
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                setErr(''); setBusy(true)
                await startUpload([f])
                e.target.value = ''
              }} />
          </label>
        </div>
        {err && <p className="text-xs" style={{ color: '#DC2626' }}>{err}</p>}
        {value && isImage && (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border" style={{ borderColor: '#E5E7EB' }}>
            <Image src={value} alt="preview" fill className="object-contain bg-slate-50" sizes="600px" />
            <button type="button" onClick={() => onChange('')}
              className="absolute top-2 right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.55)' }}>✕</button>
          </div>
        )}
        {value && !isImage && (
          <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <span className="text-green-600 text-xs">📄</span>
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 underline truncate">{value}</a>
            <button type="button" onClick={() => onChange('')} className="ml-auto text-xs text-red-400">✕</button>
          </div>
        )}
      </div>
    </FormField>
  )
}

export default function SertaMertaAdminPage() {
  const [list, setList] = useState<SertaMerta[]>([])
  const [form, setForm] = useState<Partial<SertaMerta> | null>(null)
  const [pending, start] = useTransition()
  const { show, ToastEl } = useToast()

  function load() {
    fetch('/api/admin/serta-merta').then((r) => r.json()).then((d) => setList(Array.isArray(d) ? d : []))
  }
  useEffect(() => { load() }, [])

  function handleSave() {
    if (!form?.judul?.trim()) return show('Judul wajib diisi', 'error')
    start(async () => {
      try {
        const method = form.id ? 'PUT' : 'POST'
        await fetch('/api/admin/serta-merta', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, aktif: form.aktif ?? true, urutan: form.urutan ?? 0, tipe: form.tipe ?? 'DOKUMEN' }),
        })
        show(form.id ? 'Data diperbarui' : 'Data ditambahkan')
        setForm(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/serta-merta?id=${id}`, { method: 'DELETE' })
    show('Data dihapus'); load()
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Informasi Serta Merta"
          action={<BtnAdd label="Tambah Informasi" onClick={() => setForm({ aktif: true, tipe: 'DOKUMEN', urutan: list.length })} />} />
        <AdminTable headers={['Judul', 'Tipe', 'File/Gambar', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={5}><EmptyState label="Belum ada informasi serta merta" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <p className="font-semibold text-xs" style={{ color: '#0A2342' }}>{d.judul}</p>
                  {d.deskripsi && <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{d.deskripsi}</p>}
                </AdminTd>
                <AdminTd>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: d.tipe === 'GAMBAR' ? '#EFF6FF' : '#F0FDF4', color: d.tipe === 'GAMBAR' ? '#0D47A1' : '#065F46' }}>
                    {d.tipe}
                  </span>
                </AdminTd>
                <AdminTd>
                  {d.gambar && <span className="text-xs text-blue-500">🖼️ Gambar</span>}
                  {d.file && <span className="text-xs text-green-600">📄 Dokumen</span>}
                  {!d.gambar && !d.file && <span className="text-xs text-slate-300">-</span>}
                </AdminTd>
                <AdminTd><StatusBadge active={d.aktif} /></AdminTd>
                <AdminTd>
                  <div className="flex gap-1.5">
                    <BtnEdit onClick={() => setForm({ ...d })} />
                    <BtnDelete label={d.judul} onConfirm={() => handleDelete(d.id)} />
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Informasi Serta Merta' : 'Tambah Informasi Serta Merta'} />
          <div className="p-5 flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Judul" required>
                <Input value={form.judul ?? ''} onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  placeholder="Judul informasi serta merta" />
              </FormField>
              <FormField label="Tipe">
                <select value={form.tipe ?? 'DOKUMEN'} onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                  style={{ border: '1px solid #DBEAFE', background: '#F8FAFF', color: '#0A2342' }}>
                  <option value="DOKUMEN">Dokumen</option>
                  <option value="GAMBAR">Gambar</option>
                  <option value="KEDUANYA">Dokumen + Gambar</option>
                </select>
              </FormField>
              <FormField label="Urutan">
                <Input type="number" value={form.urutan ?? 0}
                  onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })} />
              </FormField>
              <FormField label="URL Sosial Media (opsional)" hint="Link share ke FB/IG/Twitter">
                <Input value={form.urlSosmed ?? ''} placeholder="https://..."
                  onChange={(e) => setForm({ ...form, urlSosmed: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Deskripsi">
              <Textarea rows={3} value={form.deskripsi ?? ''}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat..." />
            </FormField>
            {(form.tipe === 'GAMBAR' || form.tipe === 'KEDUANYA') && (
              <UploadField label="Upload Gambar" value={form.gambar ?? ''}
                onChange={(v) => setForm({ ...form, gambar: v })}
                accept="image/jpeg,image/png,image/webp" hint="Upload JPG/PNG/WebP maks 4MB" />
            )}
            {(form.tipe === 'DOKUMEN' || form.tipe === 'KEDUANYA') && (
              <UploadField label="Upload Dokumen (PDF)" value={form.file ?? ''}
                onChange={(v) => setForm({ ...form, file: v })}
                accept="application/pdf" hint="Upload PDF maks 16MB" />
            )}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="aktif-sm" checked={form.aktif ?? true}
                onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
              <label htmlFor="aktif-sm" className="text-xs font-semibold" style={{ color: '#374151' }}>Aktif (tampil di publik)</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
            <BtnSecondary onClick={() => setForm(null)}>Batal</BtnSecondary>
            <BtnPrimary onClick={handleSave} loading={pending}>{form.id ? 'Simpan' : 'Tambah'}</BtnPrimary>
          </div>
        </AdminCard>
      )}
    </div>
  )
}
