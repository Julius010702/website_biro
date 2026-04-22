// app/api/admin/ppid/maklumat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.maklumatPelayanan.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(data)
  } catch (e) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await prisma.maklumatPelayanan.create({ data: body })
    return NextResponse.json(data)
  } catch (e) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...rest } = await req.json()
    const data = await prisma.maklumatPelayanan.update({ where: { id }, data: rest })
    return NextResponse.json(data)
  } catch (e) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')!
    await prisma.maklumatPelayanan.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }) }
}