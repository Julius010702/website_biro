import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = await prisma.situsTerkait.update({ where: { id }, data: body })
    return NextResponse.json(data)
  } catch (e) {
    console.error('[PUT situs-terkait/[id]]', e)
    return NextResponse.json({ error: 'Gagal memperbarui' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.situsTerkait.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[DELETE situs-terkait/[id]]', e)
    return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 })
  }
}
