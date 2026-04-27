// app/api/admin/informasi-publik/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function ok(data: unknown) {
  return NextResponse.json({ data })
}
function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

// PUT — update item
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { judul, deskripsi, kategori, tipe, url, urlDokumen, urutan, aktif } = body

    const data = await prisma.informasiPublik.update({
      where: { id: params.id },
      data: {
        ...(judul       !== undefined && { judul:      judul.trim() }),
        ...(deskripsi   !== undefined && { deskripsi:  deskripsi?.trim()  || null }),
        ...(kategori    !== undefined && { kategori:   kategori?.trim()   || null }),
        ...(tipe        !== undefined && { tipe }),
        ...(url         !== undefined && { url:        url?.trim()        || null }),
        ...(urlDokumen  !== undefined && { urlDokumen: urlDokumen?.trim() || null }),
        ...(urutan      !== undefined && { urutan:     Number(urutan) }),
        ...(aktif       !== undefined && { aktif }),
      },
    })
    return ok(data)
  } catch {
    return err('Gagal memperbarui data', 500)
  }
}

// DELETE — hapus item
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.informasiPublik.delete({ where: { id: params.id } })
    return ok({ deleted: true })
  } catch {
    return err('Gagal menghapus data', 500)
  }
}