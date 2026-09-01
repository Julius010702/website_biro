'use client'
// app/components/(admin)/GrafikAktivitas.tsx
import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { Activity } from 'lucide-react'

type AktivitasData = {
  tanggal: string
  label: string
  views: number
  keberatan: number
  total: number
}

type TooltipPayloadItem = {
  dataKey: string
  name: string
  value: number
  color: string
}

function CustomTooltip({
  active, payload, label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload || !payload.length) return null
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 4px 16px rgba(13,71,161,0.12)' }}
    >
      <p className="font-bold mb-1" style={{ color: '#0A2342' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-1.5" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: '#64748B' }}>{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function GrafikAktivitas() {
  const [data, setData]       = useState<AktivitasData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard/aktivitas')
      .then((r) => r.json())
      .then((d) => setData(Array.isArray(d) ? d : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [])

  const totalMinggu = data.reduce((sum, d) => sum + d.total, 0)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 2px 10px rgba(13,71,161,0.06)' }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: '#0D47A1' }} />
          <h3 className="text-xs font-bold" style={{ color: '#0A2342' }}>Gelombang Aktivitas</h3>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-lg" style={{ background: '#EFF6FF', color: '#1565C0' }}>
          30 hari terakhir - {totalMinggu} aktivitas
        </span>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-xs text-slate-300">Memuat data...</div>
        ) : data.length === 0 || totalMinggu === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-300">
            <Activity className="w-8 h-8" />
            <p className="text-xs">Belum ada aktivitas tercatat.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0D47A1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0D47A1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradKeberatan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#D97706" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FC" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                axisLine={{ stroke: '#EEF3FC' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="views"
                name="Views Berita"
                stroke="#0D47A1"
                strokeWidth={2}
                fill="url(#gradViews)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="keberatan"
                name="Keberatan"
                stroke="#D97706"
                strokeWidth={2}
                fill="url(#gradKeberatan)"
                stackId="1"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center gap-4 px-4 py-2.5" style={{ borderTop: '1px solid #EEF3FC' }}>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: '#64748B' }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#0D47A1' }} /> Views Berita
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: '#64748B' }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#D97706' }} /> Pengajuan Keberatan
        </span>
      </div>
    </div>
  )
}
