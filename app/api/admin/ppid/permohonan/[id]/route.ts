// app/api/admin/ppid/permohonan/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await prisma.permohonanInformasi.findUnique({
      where: { id: params.id },
    })
    if (!data) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 })
    return NextResponse.json(data)
  } catch (e) {
    console.error('[GET /api/admin/ppid/permohonan/[id]]', e)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}