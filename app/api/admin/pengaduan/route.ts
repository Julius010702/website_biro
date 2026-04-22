// app/api/admin/pengaduan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { StatusPengaduan } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status') as StatusPengaduan | null
    const data = await prisma.pengaduan.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, tanggapan } = await req.json()
    const data = await prisma.pengaduan.update({
      where: { id },
      data: { status, tanggapan },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')!
    await prisma.pengaduan.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 })
  }
}