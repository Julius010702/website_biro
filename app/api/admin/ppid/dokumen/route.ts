// ═══════════════════════════════════════════════════════════════════════════════
// FILE: app/api/admin/ppid/dokumen/route.ts  (UPDATE dari versi sebelumnya)
// ═══════════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const kategori = req.nextUrl.searchParams.get('kategori') as any
    const data = await prisma.dokumenPPID.findMany({
      where: kategori ? { kategori } : undefined,
      orderBy: [{ tahun: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/admin/ppid/dokumen]', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}