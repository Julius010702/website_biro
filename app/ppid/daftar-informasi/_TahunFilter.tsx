'use client'
import { Search } from 'lucide-react'

export default function TahunFilter({
  tahunList,
  tahunParam,
  katParam,
}: {
  tahunList: (number | null)[]
  tahunParam?: string
  katParam?: string
}) {
  if (!tahunList.length) return null

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const t   = e.target.value
    const kat = katParam ? `&kategori=${katParam}` : ''
    window.location.href = t
      ? `/ppid/daftar-informasi?tahun=${t}${kat}`
      : `/ppid/daftar-informasi${katParam ? `?kategori=${katParam}` : ''}`
  }

  return (
    <div className="ml-auto flex items-center gap-2">
      <Search className="w-3.5 h-3.5 text-slate-400" />
      <select
        defaultValue={tahunParam ?? ''}
        onChange={handleChange}
        className="text-[11px] border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white"
      >
        <option value="">Semua Tahun</option>
        {tahunList.map((t) => (
          <option key={t} value={t ?? ''}>{t}</option>
        ))}
      </select>
    </div>
  )
}
