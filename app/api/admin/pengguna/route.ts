// app/api/admin/pengguna/route.ts
// ============================================================
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
 
async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
}
 
export async function GET() {
  try {
    await requireAuth()
    const data = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
 
export async function POST(req: Request) {
  try {
    await requireAuth()
    const body = await req.json()
    if (!body.password || body.password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 })
    }
    const hashed = await bcrypt.hash(body.password, 12)
    const data = await prisma.user.create({
      data: { name: body.name, email: body.email, password: hashed, role: body.role ?? 'ADMIN' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json(data, { status: 201 })
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
 