// app/api/admin/berita/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/admin/berita — ambil semua berita
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const search = searchParams.get('search') ?? ''
  const kategori = searchParams.get('kategori') ?? ''

  const skip = (page - 1) * limit

  const where = {
    ...(search && {
      judul: { contains: search, mode: 'insensitive' as const },
    }),
    ...(kategori && { kategori }),
  }

  const [data, total] = await Promise.all([
    prisma.berita.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        judul: true,
        slug: true,
        kategori: true,
        publish: true,
        gambar: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.berita.count({ where }),
  ])

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

// POST /api/admin/berita — buat berita baru
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const { judul, slug, konten, gambar, kategori, publish } = body

  if (!judul || !slug || !konten) {
    return NextResponse.json(
      { message: 'Judul, slug, dan konten wajib diisi' },
      { status: 400 }
    )
  }

  // Cek slug duplikat
  const existing = await prisma.berita.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json(
      { message: 'Slug sudah digunakan, gunakan slug lain' },
      { status: 409 }
    )
  }

  const berita = await prisma.berita.create({
    data: {
      judul,
      slug,
      konten,
      gambar: gambar ?? null,
      kategori: kategori ?? null,
      publish: publish ?? false,
    },
  })

  return NextResponse.json(berita, { status: 201 })
}