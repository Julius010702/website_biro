// app/api/admin/kontak/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const dibaca = req.nextUrl.searchParams.get('dibaca')
    const data = await prisma.kontak.findMany({
      where: dibaca !== null ? { dibaca: dibaca === 'true' } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(data)
  } catch (e) {
    console.error('[GET /api/admin/kontak]', e)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, dibaca } = await req.json()
    const data = await prisma.kontak.update({ where: { id }, data: { dibaca } })
    return NextResponse.json(data)
  } catch (e) {
    console.error('[PUT /api/admin/kontak]', e)
    return NextResponse.json({ error: 'Gagal memperbarui' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')!
    await prisma.kontak.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/admin/kontak]', e)
    return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 })
  }
}