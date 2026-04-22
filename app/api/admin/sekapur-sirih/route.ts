// app/api/admin/sekapur-sirih/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const data = await prisma.sekapurSirih.findFirst({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(data)
}