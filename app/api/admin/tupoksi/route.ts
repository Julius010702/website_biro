import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const data = await prisma.tugasPokokFungsi.findMany({
    orderBy: [{ urutan: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await prisma.tugasPokokFungsi.create({ data: body })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...rest } = await req.json()
    const data = await prisma.tugasPokokFungsi.update({ where: { id }, data: rest })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')!
    await prisma.tugasPokokFungsi.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}
