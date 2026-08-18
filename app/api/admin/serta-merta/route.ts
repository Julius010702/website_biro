// app/api/admin/serta-merta/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.informasiSertaMerta.findMany({
      orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await prisma.informasiSertaMerta.create({ data: body })
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...rest } = await req.json()
    const data = await prisma.informasiSertaMerta.update({ where: { id }, data: rest })
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')!
    await prisma.informasiSertaMerta.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}
