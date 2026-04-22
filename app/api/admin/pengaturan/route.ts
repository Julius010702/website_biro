// app/api/admin/pengaturan/route.ts
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
    const data = await prisma.siteSettings.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
 
export async function PUT(req: Request) {
  try {
    await requireAuth()
    const body: Record<string, string> = await req.json()
    const ops = Object.entries(body).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where:  { key },
        update: { value },
        create: { key, value },
      })
    )
    await Promise.all(ops)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}