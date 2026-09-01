// app/api/berita/[slug]/share/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buatNotifikasi } from '@/lib/notifikasi'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const berita = await prisma.berita.update({
      where:  { slug },
      data:   { shares: { increment: 1 } },
      select: { id: true, judul: true, shares: true },
    })

    await buatNotifikasi({
      tipe:  'BERITA_SHARE',
      judul: 'Berita Dibagikan',
      pesan: `Berita "${berita.judul}" baru saja dibagikan oleh pembaca.`,
      link:  `/berita/${slug}`,
    })

    return NextResponse.json({ shares: berita.shares })
  } catch {
    return NextResponse.json({ error: 'Gagal mencatat share' }, { status: 500 })
  }
}
