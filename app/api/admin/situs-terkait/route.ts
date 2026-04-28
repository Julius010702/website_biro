// app/api/admin/situs-terkait/route.ts
import { NextResponse } from 'next/server'
import { prisma }       from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.situsTerkait.findMany({
      orderBy: [{ urutan: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}