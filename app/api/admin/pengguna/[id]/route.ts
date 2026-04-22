// app/api/admin/pengguna/[id]/route.ts
// ============================================================
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
 
async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
}
 
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await req.json()
    const updateData: Record<string, unknown> = {}
    if (body.name)     updateData.name  = body.name
    if (body.email)    updateData.email = body.email
    if (body.role)     updateData.role  = body.role
    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(body.password, 12)
    }
    const data = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
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
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
 