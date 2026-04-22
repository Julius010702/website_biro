// app/api/admin/ppid/dokumen/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { KategoriPPID } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const kategori = req.nextUrl.searchParams.get('kategori') as KategoriPPID | null
    const data = await prisma.dokumenPPID.findMany({
      where: kategori ? { kategori } : undefined,
      orderBy: [{ tahun: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await prisma.dokumenPPID.create({ data: body })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...rest } = await req.json()
    const data = await prisma.dokumenPPID.update({ where: { id }, data: rest })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')!
    await prisma.dokumenPPID.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}