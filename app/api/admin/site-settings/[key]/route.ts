import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params
    await prisma.siteSettings.delete({ where: { key } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[DELETE site-settings/[key]]', e)
    return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 })
  }
}
