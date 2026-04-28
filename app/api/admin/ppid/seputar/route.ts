// app/api/admin/ppid/seputar/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.seputarPPID.findFirst({  // ✅ tabel yang benar
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(data ?? {})
  } catch (e) {
    console.error('[GET /api/admin/ppid/seputar]', e)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, ...body } = await req.json()
    const data = id
      ? await prisma.seputarPPID.update({ where: { id }, data: body })  // ✅
      : await prisma.seputarPPID.create({ data: body })                  // ✅
    return NextResponse.json(data)
  } catch (e) {
    console.error('[POST /api/admin/ppid/seputar]', e)
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  }
}