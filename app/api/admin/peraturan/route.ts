// app/api/admin/peraturan/route.ts
// ============================================================
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { TipePeraturan } from '@prisma/client'
 
async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
}
 
export async function GET(req: Request) {
  try {
    await requireAuth()
    const { searchParams } = new URL(req.url)
    const q    = searchParams.get('q') ?? ''
    const tipe = searchParams.get('tipe') ?? ''
    const data = await prisma.peraturan.findMany({
      where: {
        ...(q    ? { OR: [{ judul: { contains: q, mode: 'insensitive' } }, { nomor: { contains: q } }] } : {}),
        ...(tipe ? { tipe: tipe as TipePeraturan } : {}),
      },
      orderBy: [{ tahun: 'desc' }, { createdAt: 'desc' }],
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
    const data = await prisma.peraturan.create({
      data: {
        nomor:   body.nomor,
        judul:   body.judul,
        tahun:   Number(body.tahun),
        tentang: body.tentang,
        file:    body.file || null,
        tipe:    body.tipe as TipePeraturan,
        subTipe: body.subTipe || null,
        aktif:   body.aktif ?? true,
      },
    })
    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
 