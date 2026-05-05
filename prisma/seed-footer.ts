import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const kontakData = [
    { nama: 'Alamat', nilai: 'Jl. Basuki Rahmat No. 1, Kelapa Lima, Kupang, NTT 85111', ikon: 'MapPin', tipe: 'teks', urutan: 0 },
    { nama: 'Telepon', nilai: '(0380) 831021', ikon: 'Phone', tipe: 'teks', urutan: 1 },
    { nama: 'Email', nilai: 'biroorganisasi@nttprov.go.id', ikon: 'Mail', tipe: 'email', urutan: 2 },
    { nama: 'Jam Kerja', nilai: 'Senin - Jumat: 08.00 - 16.00 WITA', ikon: 'Clock', tipe: 'teks', urutan: 3 },
  ]
  for (const k of kontakData) {
    const existing = await prisma.informasiKontak.findFirst({ where: { nama: k.nama } })
    if (!existing) {
      await prisma.informasiKontak.create({ data: k })
      console.log('Created kontak:', k.nama)
    } else {
      console.log('Skip kontak:', k.nama)
    }
  }

  const situsData = [
    { label: 'Portal NTT', href: 'https://nttprov.go.id', external: true, aktif: true, urutan: 0 },
    { label: 'PPID NTT', href: 'https://ppid.nttprov.go.id', external: true, aktif: true, urutan: 1 },
    { label: 'SAKIP NTT', href: 'https://sakip.nttprov.go.id', external: true, aktif: true, urutan: 2 },
  ]
  for (const s of situsData) {
    const existing = await prisma.situsTerkait.findFirst({ where: { label: s.label } })
    if (!existing) {
      await prisma.situsTerkait.create({ data: s })
      console.log('Created situs:', s.label)
    } else {
      console.log('Skip situs:', s.label)
    }
  }

  const sosmedData = [
    { key: 'sosmed_instagram', value: JSON.stringify({ platform: 'Instagram', url: 'https://www.instagram.com/organisasi_nttprov/', aktif: true }), label: 'Instagram' },
    { key: 'sosmed_youtube', value: JSON.stringify({ platform: 'YouTube', url: 'https://youtube.com', aktif: true }), label: 'YouTube' },
  ]
  for (const s of sosmedData) {
    await prisma.siteSettings.upsert({ where: { key: s.key }, update: {}, create: s })
    console.log('Upsert sosmed:', s.key)
  }

  console.log('Seed footer selesai!')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
