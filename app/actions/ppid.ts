// app/actions/ppid.ts
'use server'
import { prisma }          from '@/lib/prisma'
import { redirect }        from 'next/navigation'
import { buatNotifikasi }  from '@/lib/notifikasi'

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

  const now           = new Date()
  const tgl           = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand          = Math.floor(1000 + Math.random() * 9000)
  const nomorRegister = `PPID-${tgl}-${rand}`

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

  await buatNotifikasi({
    tipe:  'PERMOHONAN',
    judul: 'Permohonan Informasi Baru',
    pesan: `${namaPemohon} mengajukan permohonan informasi publik (No. ${nomorRegister}).`,
    link:  '/admin/ppid/permohonan',
  })

  redirect(`/ppid/permohonan?success=1&ref=${nomorRegister}`)
}

export async function submitKeberatan(formData: FormData) {
  const nomorPendaftaran = formData.get('nomorPendaftaran') as string
  const tujuanPenggunaan = formData.get('tujuanPenggunaan') as string
  const namaLengkap      = formData.get('namaLengkap')      as string
  const alamat           = formData.get('alamat')           as string | null
  const pekerjaan        = formData.get('pekerjaan')        as string | null
  const email            = formData.get('email')            as string
  const telepon          = formData.get('telepon')          as string
  const kuasaNama        = formData.get('kuasaNama')        as string | null
  const kuasaAlamat      = formData.get('kuasaAlamat')      as string | null
  const kuasaTelepon     = formData.get('kuasaTelepon')     as string | null
  const kasusPosisi      = formData.get('kasusPosisi')      as string
  const tandaTangan      = formData.get('tandaTangan')      as string

  const alasanA = formData.get('alasanA') === 'on'
  const alasanB = formData.get('alasanB') === 'on'
  const alasanC = formData.get('alasanC') === 'on'
  const alasanD = formData.get('alasanD') === 'on'
  const alasanE = formData.get('alasanE') === 'on'
  const alasanF = formData.get('alasanF') === 'on'
  const alasanG = formData.get('alasanG') === 'on'

  if (!alasanA && !alasanB && !alasanC && !alasanD && !alasanE && !alasanF && !alasanG) {
    throw new Error('Pilih minimal satu alasan pengajuan keberatan.')
  }
  if (!tandaTangan || tandaTangan.length < 100) {
    throw new Error('Tanda tangan wajib diisi.')
  }

  const now        = new Date()
  const tgl        = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand       = Math.floor(1000 + Math.random() * 9000)
  const nomorTiket = `KBR-${tgl}-${rand}`

  await prisma.keberatan.create({
    data: {
      nomorTiket,
      nomorPendaftaran,
      tujuanPenggunaan,
      namaLengkap,
      alamat:       alamat       || null,
      pekerjaan:    pekerjaan    || null,
      email,
      telepon,
      kuasaNama:    kuasaNama    || null,
      kuasaAlamat:  kuasaAlamat  || null,
      kuasaTelepon: kuasaTelepon || null,
      alasanA, alasanB, alasanC, alasanD, alasanE, alasanF, alasanG,
      kasusPosisi,
      tandaTangan,
      status: 'PENDING',
    },
  })

  await prisma.kontak.create({
    data: {
      nama:    namaLengkap,
      email:   email || 'tidak-ada@email.com',
      telepon: telepon || null,
      subjek:  `[Pengajuan Keberatan] No. ${nomorTiket}`,
      pesan:   `Nomor Pendaftaran Permohonan: ${nomorPendaftaran}\n\nKasus Posisi:\n${kasusPosisi}`,
      dibaca:  false,
    },
  })

  await buatNotifikasi({
    tipe:  'KEBERATAN',
    judul: 'Pengajuan Keberatan Baru',
    pesan: `${namaLengkap} mengajukan keberatan (No. ${nomorTiket}).`,
    link:  '/admin/ppid/keberatan',
  })

  redirect(`/ppid/permohonan?success=1&ref=${nomorTiket}`)
}
