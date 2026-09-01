// app/api/admin/notifikasi/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const onlyUnread = req.nextUrl.searchParams.get('unread') === '1'
    const [list, unreadCount] = await Promise.all([
      prisma.notifikasi.findMany({
        where:   onlyUnread ? { dibaca: false } : undefined,
        orderBy: { createdAt: 'desc' },
        take:    30,
      }),
      prisma.notifikasi.count({ where: { dibaca: false } }),
    ])
    return NextResponse.json({ list, unreadCount })
  } catch {
    return NextResponse.json({ error: 'Gagal memuat notifikasi' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.markAll) {
      await prisma.notifikasi.updateMany({ where: { dibaca: false }, data: { dibaca: true } })
      return NextResponse.json({ ok: true })
    }
    if (body.id) {
      await prisma.notifikasi.update({ where: { id: body.id }, data: { dibaca: true } })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'id atau markAll diperlukan' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui notifikasi' }, { status: 500 })
  }
}
