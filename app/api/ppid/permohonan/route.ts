import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateRegisterNumber } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nomorRegister = generateRegisterNumber()
    const permohonan = await prisma.permohonanInformasi.create({
      data: {
        namaPemohon: body.namaPemohon,
        nik: body.nik || null,
        telepon: body.telepon,
        email: body.email || null,
        pekerjaan: body.pekerjaan || null,
        informasiDiminta: body.informasiDiminta,
        tujuanPenggunaan: body.tujuanPenggunaan,
        caraPenyampaian: body.caraPenyampaian,
        nomorRegister,
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
        namaPemohon: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!permohonan) return NextResponse.json({ error: 'Permohonan tidak ditemukan' }, { status: 404 })
    return NextResponse.json(permohonan)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}