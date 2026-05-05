import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.informasiKontak.findMany({ orderBy: { urutan: 'asc' } })
    return NextResponse.json(data)
  } catch (e) {
    console.error('[GET /api/admin/informasi-kontak]', e)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await prisma.informasiKontak.create({ data: body })
    return NextResponse.json(data)
  } catch (e) {
    console.error('[POST /api/admin/informasi-kontak]', e)
    return NextResponse.json({ error: 'Gagal membuat data' }, { status: 500 })
  }
}
