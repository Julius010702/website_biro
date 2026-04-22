// app/api/admin/galeri/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.galeri.findMany({
      orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/admin/galeri error:', err)
    return NextResponse.json({ error: 'Gagal mengambil data galeri' }, { status: 500 })
  }
}