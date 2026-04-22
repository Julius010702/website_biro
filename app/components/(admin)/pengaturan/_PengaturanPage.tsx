'use client'
// app/(admin)/admin/pengaturan/_PengaturanPage.tsx
import { useEffect, useState, useTransition } from 'react'
import { AdminCard, AdminCardHeader, BtnPrimary, FormField, Input, Textarea, useToast } from '@/components/admin/AdminUI'
import { upsertSiteSetting } from '@/actions/admin'

const DEFAULT_KEYS = [
  { key: 'site_name',       label: 'Nama Situs',         type: 'text' },
  { key: 'site_tagline',    label: 'Tagline',             type: 'text' },
  { key: 'site_email',      label: 'Email Kontak',        type: 'text' },
  { key: 'site_phone',      label: 'Nomor Telepon',       type: 'text' },
  { key: 'site_address',    label: 'Alamat',              type: 'textarea' },
  { key: 'site_jam_kerja',  label: 'Jam Operasional',     type: 'text' },
  { key: 'site_facebook',   label: 'Facebook URL',        type: 'text' },
  { key: 'site_instagram',  label: 'Instagram URL',       type: 'text' },
  { key: 'site_youtube',    label: 'YouTube URL',         type: 'text' },
  { key: 'hero_tagline',    label: 'Tagline Hero Slider', type: 'text' },
]

export default function PengaturanPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [pending, start]        = useTransition()
  const { show, ToastEl }       = useToast()

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/pengaturan')
      .then((r) => r.json())
      .then((data: { key: string; value: string }[]) => {
        if (!cancelled) {
          const map: Record<string, string> = {}
          data.forEach((s) => { map[s.key] = s.value })
          setSettings(map)
        }
      })
    return () => { cancelled = true }
  }, [])

  function handleSave() {
    start(async () => {
      try {
        await Promise.all(
          DEFAULT_KEYS.map((k) =>
            upsertSiteSetting(k.key, settings[k.key] ?? '', k.label)
          )
        )
        show('Pengaturan disimpan')
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />
      <AdminCard>
        <AdminCardHeader title="Pengaturan Situs" />
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          {DEFAULT_KEYS.map((k) => (
            <div key={k.key} className={k.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <FormField label={k.label}>
                {k.type === 'textarea' ? (
                  <Textarea
                    value={settings[k.key] ?? ''}
                    onChange={(e) => setSettings({ ...settings, [k.key]: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={settings[k.key] ?? ''}
                    onChange={(e) => setSettings({ ...settings, [k.key]: e.target.value })}
                    placeholder={k.label}
                  />
                )}
              </FormField>
            </div>
          ))}
        </div>
        <div className="flex justify-end px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
          <BtnPrimary onClick={handleSave} loading={pending}>Simpan Semua Pengaturan</BtnPrimary>
        </div>
      </AdminCard>
    </div>
  )
}