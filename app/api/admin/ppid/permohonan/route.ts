// app/api/admin/ppid/permohonan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { StatusPermohonan } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status') as StatusPermohonan | null
    const data = await prisma.permohonanInformasi.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, keterangan, nomorRegister } = await req.json()
    const data = await prisma.permohonanInformasi.update({
      where: { id },
      data: { status, keterangan, nomorRegister },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}