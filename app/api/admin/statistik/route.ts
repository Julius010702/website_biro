// app/api/admin/statistik/route.ts
// ============================================================
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
 
async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
}
 
export async function GET() {
  try {
    await requireAuth()
    const data = await prisma.statistikBeranda.findMany({ orderBy: { urutan: 'asc' } })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
 
export async function POST(req: Request) {
  try {
    await requireAuth()
    const body = await req.json()
    const data = await prisma.statistikBeranda.create({
      data: {
        label:  body.label,
        nilai:  body.nilai,
        ikon:   body.ikon ?? 'Building2',
        urutan: body.urutan ?? 0,
      },
    })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}