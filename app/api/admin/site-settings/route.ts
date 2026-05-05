import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const prefix = req.nextUrl.searchParams.get('prefix')
    const data = await prisma.siteSettings.findMany({
      where: prefix ? { key: { startsWith: prefix } } : undefined,
    })
    return NextResponse.json(data)
  } catch (e) {
    console.error('[GET /api/admin/site-settings]', e)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { key, value, label } = await req.json()
    const data = await prisma.siteSettings.upsert({
      where: { key },
      update: { value, label },
      create: { key, value, label },
    })
    return NextResponse.json(data)
  } catch (e) {
    console.error('[PUT /api/admin/site-settings]', e)
    return NextResponse.json({ error: 'Gagal menyimpan' }, { status: 500 })
  }
}
