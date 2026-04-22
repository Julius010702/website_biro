// app/api/admin/statistik/[id]/route.ts
// ============================================================
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
 
async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
}
 
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await req.json()
    const data = await prisma.statistikBeranda.update({
      where: { id },
      data: {
        ...(body.label  !== undefined && { label:  body.label }),
        ...(body.nilai  !== undefined && { nilai:  body.nilai }),
        ...(body.ikon   !== undefined && { ikon:   body.ikon }),
        ...(body.urutan !== undefined && { urutan: body.urutan }),
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
    await prisma.statistikBeranda.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}