'use client'
// app/(admin)/admin/berita/_BeritaPage.tsx
import { useEffect, useState, useTransition } from 'react'
import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnAdd, BtnEdit, BtnDelete, BtnPrimary, BtnSecondary,
  FormField, Input, Textarea, StatusBadge, EmptyState, useToast,
} from '@/components/admin/AdminUI'
import { upsertBerita, deleteBerita, togglePublishBerita } from '@/actions/admin'
import { Eye, Search } from 'lucide-react'

type Berita = {
  konten: string
  id: string; judul: string; slug: string; ringkasan: string | null
  gambar: string | null; kategori: string | null; penulis: string | null
  publish: boolean; views: number; createdAt: string; tags: string[]
}

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

export default function BeritaPage() {
  const [list, setList]     = useState<Berita[]>([])
  const [form, setForm]     = useState<Partial<Berita> | null>(null)
  const [search, setSearch] = useState('')
  const [pending, start]    = useTransition()
  const { show, ToastEl }   = useToast()

  // ✅ Fix: ambil .data dari response karena API return { data: [], total: ... }
  function load() {
    fetch('/api/admin/berita')
      .then((r) => r.json())
      .then((d) => setList(Array.isArray(d) ? d : (d?.data ?? [])))
      .catch(() => setList([]))
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/berita')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setList(Array.isArray(d) ? d : (d?.data ?? []))
      })
      .catch(() => { if (!cancelled) setList([]) })
    return () => { cancelled = true }
  }, [])

  const filtered = list.filter((b) =>
    b.judul.toLowerCase().includes(search.toLowerCase())
  )

  function openNew() {
    setForm({ publish: false, tags: [] })
  }

  function openEdit(b: Berita) {
    setForm({ ...b })
  }

  function handleSave() {
    if (!form?.judul || !form?.slug) return show('Judul dan slug wajib diisi', 'error')
    start(async () => {
      try {
        await upsertBerita({
          id:        form.id,
          judul:     form.judul!,
          slug:      form.slug!,
          konten:    form.konten ?? '',
          ringkasan: form.ringkasan ?? undefined,
          gambar:    form.gambar ?? undefined,
          kategori:  form.kategori ?? undefined,
          penulis:   form.penulis ?? undefined,
          tags:      form.tags ?? [],
          publish:   form.publish ?? false,
        })
        show(form.id ? 'Berita diperbarui' : 'Berita disimpan')
        setForm(null)
        load()
      } catch {
        show('Terjadi kesalahan', 'error')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />

      {/* ── List ── */}
      <AdminCard>
        <AdminCardHeader
          title="Daftar Berita"
          action={<BtnAdd label="Tambah Berita" onClick={openNew} />}
        />

        {/* Search */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #EEF3FC' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl max-w-sm" style={{ background: '#F8FAFF', border: '1px solid #DBEAFE' }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: '#94A3B8' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul berita..."
              className="flex-1 text-xs outline-none bg-transparent"
              style={{ color: '#0A2342' }}
            />
          </div>
        </div>

        <AdminTable headers={['Judul', 'Kategori', 'Penulis', 'Views', 'Status', 'Aksi']}>
          {filtered.length === 0 ? (
            <tr><td colSpan={6}><EmptyState label="Belum ada berita" /></td></tr>
          ) : filtered.map((b) => (
            <AdminTr key={b.id}>
              <AdminTd>
                <p className="font-semibold line-clamp-1 max-w-xs" style={{ color: '#0A2342' }}>{b.judul}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>{b.slug}</p>
              </AdminTd>
              <AdminTd>{b.kategori ?? '-'}</AdminTd>
              <AdminTd>{b.penulis ?? '-'}</AdminTd>
              <AdminTd>
                <div className="flex items-center gap-1" style={{ color: '#64748B' }}>
                  <Eye className="w-3 h-3" /> {b.views}
                </div>
              </AdminTd>
              <AdminTd>
                <StatusBadge
                  active={b.publish}
                  onClick={() => {
                    start(async () => {
                      await togglePublishBerita(b.id, !b.publish)
                      load()
                    })
                  }}
                />
              </AdminTd>
              <AdminTd>
                <div className="flex items-center gap-1.5">
                  <BtnEdit onClick={() => openEdit(b)} />
                  <BtnDelete
                    label={b.judul}
                    onConfirm={async () => { await deleteBerita(b.id); load() }}
                  />
                </div>
              </AdminTd>
            </AdminTr>
          ))}
        </AdminTable>
      </AdminCard>

      {/* ── Form ── */}
      {form !== null && (
        <AdminCard>
          <AdminCardHeader title={form.id ? 'Edit Berita' : 'Tambah Berita'} />
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <FormField label="Judul" required>
              <Input
                value={form.judul ?? ''}
                onChange={(e) => setForm({
                  ...form,
                  judul: e.target.value,
                  slug: form.id ? form.slug : slugify(e.target.value),
                })}
              />
            </FormField>

            <FormField label="Slug" required hint="Otomatis dari judul, bisa diedit manual">
              <Input
                value={form.slug ?? ''}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </FormField>

            <FormField label="Kategori">
              <Input
                value={form.kategori ?? ''}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                placeholder="Misal: Kegiatan, Pengumuman"
              />
            </FormField>

            <FormField label="Penulis">
              <Input
                value={form.penulis ?? ''}
                onChange={(e) => setForm({ ...form, penulis: e.target.value })}
              />
            </FormField>

            <FormField label="URL Gambar">
              <Input
                value={form.gambar ?? ''}
                onChange={(e) => setForm({ ...form, gambar: e.target.value })}
                placeholder="https://... atau /uploads/..."
              />
            </FormField>

            <FormField label="Tags" hint="Pisahkan dengan koma">
              <Input
                value={(form.tags ?? []).join(', ')}
                onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField label="Ringkasan">
                <Textarea
                  value={form.ringkasan ?? ''}
                  onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
                  rows={2}
                />
              </FormField>
            </div>

            <div className="sm:col-span-2">
              <FormField label="Konten (HTML)" required>
                <Textarea
                  value={form.konten ?? ''}
                  onChange={(e) => setForm({ ...form, konten: e.target.value })}
                  rows={8}
                  style={{ fontFamily: 'monospace', fontSize: '11px' }}
                />
              </FormField>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="publish-berita"
                checked={form.publish ?? false}
                onChange={(e) => setForm({ ...form, publish: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="publish-berita" className="text-xs font-semibold" style={{ color: '#374151' }}>
                Publikasikan berita ini
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
            <BtnSecondary onClick={() => setForm(null)}>Batal</BtnSecondary>
            <BtnPrimary onClick={handleSave} loading={pending}>
              {form.id ? 'Simpan Perubahan' : 'Tambah Berita'}
            </BtnPrimary>
          </div>
        </AdminCard>
      )}
    </div>
  )
}