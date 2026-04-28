// app/actions/ppid.ts
'use server'
import { prisma }   from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function submitPermohonan(formData: FormData) {
  const namaPemohon      = formData.get('namaPemohon')      as string
  const nik              = formData.get('nik')              as string | null
  const telepon          = formData.get('telepon')          as string | null
  const email            = formData.get('email')            as string | null
  const alamat           = formData.get('alamat')           as string | null
  const pekerjaan        = formData.get('pekerjaan')        as string | null
  const informasiDiminta = formData.get('informasiDiminta') as string
  const tujuanPenggunaan = formData.get('tujuanPenggunaan') as string
  const caraPenyampaian  = formData.get('caraPenyampaian')  as string

  // Generate nomor register: PPID-YYYYMMDD-XXXX
  const now           = new Date()
  const tgl           = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand          = Math.floor(1000 + Math.random() * 9000)
  const nomorRegister = `PPID-${tgl}-${rand}`

  // Simpan ke tabel PermohonanInformasi
  await prisma.permohonanInformasi.create({
    data: {
      namaPemohon,
      nik:              nik       || null,
      telepon:          telepon   || null,
      email:            email     || null,
      alamat:           alamat    || null,
      pekerjaan:        pekerjaan || null,
      informasiDiminta,
      tujuanPenggunaan,
      caraPenyampaian,
      nomorRegister,
      status: 'PENDING',
    },
  })

  // Simpan juga ke tabel Kontak agar muncul di halaman kontak admin
  await prisma.kontak.create({
    data: {
      nama:    namaPemohon,
      email:   email    || 'tidak-ada@email.com',
      telepon: telepon  || null,
      subjek:  `[Permohonan Informasi] No. ${nomorRegister}`,
      pesan:   `Informasi yang diminta:\n${informasiDiminta}\n\nTujuan penggunaan:\n${tujuanPenggunaan}\n\nCara penyampaian: ${caraPenyampaian}`,
      dibaca:  false,
    },
  })

  redirect(`/ppid/permohonan?success=1&ref=${nomorRegister}`)
}