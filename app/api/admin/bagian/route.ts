// app/api/admin/bagian/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const data = await prisma.bagian.findMany({ orderBy: { urutan: 'asc' } })
  return NextResponse.json(data)
}