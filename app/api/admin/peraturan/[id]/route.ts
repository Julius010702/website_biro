// app/api/admin/peraturan/[id]/route.ts
// ============================================================
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { TipePeraturan } from '@prisma/client'
 
async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
}
 
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await req.json()
    const data = await prisma.peraturan.update({
      where: { id },
      data: {
        ...(body.nomor   !== undefined && { nomor:   body.nomor }),
        ...(body.judul   !== undefined && { judul:   body.judul }),
        ...(body.tahun   !== undefined && { tahun:   Number(body.tahun) }),
        ...(body.tentang !== undefined && { tentang: body.tentang }),
        ...(body.file    !== undefined && { file:    body.file || null }),
        ...(body.tipe    !== undefined && { tipe:    body.tipe as TipePeraturan }),
        ...(body.subTipe !== undefined && { subTipe: body.subTipe || null }),
        ...(body.aktif   !== undefined && { aktif:   body.aktif }),
      },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
 
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth()
    const { id } = await params
    await prisma.peraturan.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
