// app/api/admin/dashboard/aktivitas/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const HARI = 7
    const now = new Date()

    // Bangun array 7 tanggal (mulai dari 6 hari lalu s/d hari ini)
    const tanggalList: { key: string; label: string; start: Date; end: Date }[] = []
    for (let i = HARI - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const end   = new Date(start)
      end.setDate(end.getDate() + 1)
      tanggalList.push({
        key:   start.toISOString().slice(0, 10),
        label: start.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' }),
        start,
        end,
      })
    }

    const rentangAwal = tanggalList[0].start

    const [viewLogs, keberatanList] = await Promise.all([
      prisma.beritaViewLog.findMany({
        where:  { createdAt: { gte: rentangAwal } },
        select: { createdAt: true },
      }),
      prisma.keberatan.findMany({
        where:  { createdAt: { gte: rentangAwal } },
        select: { createdAt: true },
      }),
    ])

    const data = tanggalList.map(({ key, label, start, end }) => {
      const views = viewLogs.filter((v) => v.createdAt >= start && v.createdAt < end).length
      const keberatan = keberatanList.filter((k) => k.createdAt >= start && k.createdAt < end).length
      return { tanggal: key, label, views, keberatan, total: views + keberatan }
    })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal memuat data aktivitas' }, { status: 500 })
  }
}
