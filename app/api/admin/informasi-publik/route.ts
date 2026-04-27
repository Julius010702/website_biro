// app/api/admin/informasi-publik/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function ok(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status })
}
function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

// GET — ambil semua item informasi publik
export async function GET() {
  try {
    const data = await prisma.informasiPublik.findMany({
      orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
    })
    return ok(data)
  } catch {
    return err('Gagal mengambil data', 500)
  }
}

// POST — buat item baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { judul, deskripsi, kategori, tipe, url, urlDokumen, urutan, aktif } = body

    if (!judul?.trim()) return err('Judul wajib diisi', 400)

    const data = await prisma.informasiPublik.create({
      data: {
        judul:      judul.trim(),
        deskripsi:  deskripsi?.trim()  || null,
        kategori:   kategori?.trim()   || null,
        tipe:       tipe || 'GAMBAR',
        url:        url?.trim()        || null,
        urlDokumen: urlDokumen?.trim() || null,
        urutan:     Number(urutan)     || 0,
        aktif:      aktif !== false,
      },
    })
    return ok(data, 201)
  } catch {
    return err('Gagal menyimpan data', 500)
  }
}