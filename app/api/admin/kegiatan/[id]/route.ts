// app/api/admin/kegiatan/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.kegiatan.delete({ where: { id } })
  return NextResponse.json({ message: 'Kegiatan berhasil dihapus' })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const kegiatan = await prisma.kegiatan.update({
    where: { id },
    data: body,
  })
  return NextResponse.json(kegiatan)
}