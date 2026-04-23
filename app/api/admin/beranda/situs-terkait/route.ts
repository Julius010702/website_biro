import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const data = await prisma.situsTerkait.findMany({
    where: { aktif: true },
    orderBy: { urutan: 'asc' },
  })
  return NextResponse.json(data)
}