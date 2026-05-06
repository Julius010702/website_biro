import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const data = await prisma.strukturOrganisasi.findFirst({
    where: { aktif: true, NOT: { deskripsi: 'STRUKTUR PPID' } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(data)
}
