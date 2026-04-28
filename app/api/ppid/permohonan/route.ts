// app/api/ppid/permohonan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateRegisterNumber } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nomorRegister = generateRegisterNumber()

    // Simpan ke tabel PermohonanInformasi
    const permohonan = await prisma.permohonanInformasi.create({
      data: {
        namaPemohon:      body.namaPemohon,
        nik:              body.nik              || null,
        alamat:           body.alamat           || null,
        telepon:          body.telepon          || null,
        email:            body.email            || null,
        pekerjaan:        body.pekerjaan        || null,
        informasiDiminta: body.informasiDiminta,
        tujuanPenggunaan: body.tujuanPenggunaan,
        caraPenyampaian:  body.caraPenyampaian,
        nomorRegister,
      },
    })

    // Simpan juga ke tabel Kontak agar muncul di halaman kontak admin
    await prisma.kontak.create({
      data: {
        nama:    body.namaPemohon,
        email:   body.email    || 'tidak-ada@email.com',
        telepon: body.telepon  || null,
        subjek:  `[Permohonan Informasi] No. ${nomorRegister}`,
        pesan:   `Informasi yang diminta:\n${body.informasiDiminta}\n\nTujuan penggunaan:\n${body.tujuanPenggunaan}\n\nCara penyampaian: ${body.caraPenyampaian}`,
        dibaca:  false,
      },
    })

    return NextResponse.json({ nomorRegister: permohonan.nomorRegister })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const nomor = searchParams.get('nomor')
  if (!nomor) return NextResponse.json({ error: 'Nomor register diperlukan' }, { status: 400 })

  try {
    const permohonan = await prisma.permohonanInformasi.findUnique({
      where: { nomorRegister: nomor },
      select: {
        nomorRegister: true,
        namaPemohon:   true,
        status:        true,
        keterangan:    true,
        createdAt:     true,
        updatedAt:     true,
      },
    })
    if (!permohonan) return NextResponse.json({ error: 'Permohonan tidak ditemukan' }, { status: 404 })
    return NextResponse.json(permohonan)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}