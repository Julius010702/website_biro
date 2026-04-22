// app/api/admin/tupoksi/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const data = await prisma.tugasPokokFungsi.findMany({ orderBy: [{ urutan: 'asc' }, { createdAt: 'asc' }] })
  return NextResponse.json(data)
}