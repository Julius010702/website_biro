import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const hashedPassword = await bcrypt.hash('Admin@NTT2024', 12)
  await prisma.user.upsert({
    where: { email: 'admin@biroorganisasi.nttprov.go.id' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@biroorganisasi.nttprov.go.id',
      password: hashedPassword,
      role: 'SUPERADMIN',
    },
  })

  const settings = [
    { key: 'site_name', value: 'Biro Organisasi Provinsi NTT', label: 'Nama Situs' },
    { key: 'site_tagline', value: 'Melayani Dengan Sepenuh Hati', label: 'Tagline' },
    { key: 'site_description', value: 'Website resmi Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur', label: 'Deskripsi' },
    { key: 'alamat', value: 'Jl. El Tari No. 1, Kupang, Nusa Tenggara Timur 85111', label: 'Alamat' },
    { key: 'telepon', value: '(0380) 831021', label: 'Telepon' },
    { key: 'email', value: 'biroorganisasi@nttprov.go.id', label: 'Email' },
    { key: 'jam_kerja', value: 'Senin - Jumat: 08.00 - 16.00 WITA', label: 'Jam Kerja' },
    { key: 'instagram', value: 'https://instagram.com/biroorganisasi_ntt', label: 'Instagram' },
    { key: 'whatsapp', value: 'https://wa.me/62380831021', label: 'WhatsApp' },
    { key: 'tiktok', value: 'https://tiktok.com/@biroorganisasi_ntt', label: 'TikTok' },
  ]

  for (const s of settings) {
    await prisma.siteSettings.upsert({ where: { key: s.key }, update: {}, create: s })
  }

  const bagians = [
    { nama: 'Bagian Kelembagaan dan Analisis Jabatan', slug: 'KELEMBAGAAN_ANALISIS_JABATAN' as const, deskripsi: 'Melaksanakan penyiapan bahan perumusan kebijakan, koordinasi dan fasilitasi di bidang kelembagaan dan analisis jabatan.', konten: '<p>Bagian Kelembagaan dan Analisis Jabatan mempunyai tugas melaksanakan penyiapan bahan perumusan kebijakan.</p>', urutan: 1 },
    { nama: 'Bagian Reformasi Birokrasi dan Akuntabilitas Kinerja', slug: 'REFORMASI_BIROKRASI_AKUNTABILITAS' as const, deskripsi: 'Melaksanakan penyiapan bahan perumusan kebijakan di bidang reformasi birokrasi dan akuntabilitas kinerja.', konten: '<p>Bagian Reformasi Birokrasi dan Akuntabilitas Kinerja mempunyai tugas melaksanakan penyiapan bahan perumusan kebijakan.</p>', urutan: 2 },
    { nama: 'Bagian Tata Laksana', slug: 'TATA_LAKSANA' as const, deskripsi: 'Melaksanakan penyiapan bahan perumusan kebijakan di bidang tata laksana pemerintahan.', konten: '<p>Bagian Tata Laksana mempunyai tugas melaksanakan penyiapan bahan perumusan kebijakan.</p>', urutan: 3 },
  ]

  for (const b of bagians) {
    await prisma.bagian.upsert({ where: { slug: b.slug }, update: {}, create: b })
  }

  const statistik = [
    { label: 'OPD Provinsi NTT', nilai: '42', ikon: 'Building2', urutan: 1 },
    { label: 'Kabupaten/Kota', nilai: '22', ikon: 'MapPin', urutan: 2 },
    { label: 'Peraturan Diterbitkan', nilai: '150+', ikon: 'FileText', urutan: 3 },
    { label: 'Layanan PPID', nilai: '100%', ikon: 'Shield', urutan: 4 },
  ]
  for (const s of statistik) {
    await prisma.statistikBeranda.create({ data: s }).catch(() => {})
  }

  const kontaks = [
    { nama: 'Alamat', nilai: 'Jl. El Tari No. 1, Kupang, Nusa Tenggara Timur 85111', ikon: 'MapPin', tipe: 'alamat', urutan: 1 },
    { nama: 'Telepon', nilai: '(0380) 831021', ikon: 'Phone', tipe: 'telepon', urutan: 2 },
    { nama: 'Email', nilai: 'biroorganisasi@nttprov.go.id', ikon: 'Mail', tipe: 'email', urutan: 3 },
    { nama: 'Jam Kerja', nilai: 'Senin - Jumat: 08.00 - 16.00 WITA', ikon: 'Clock', tipe: 'jam_kerja', urutan: 4 },
  ]
  for (const k of kontaks) {
    await prisma.informasiKontak.create({ data: k }).catch(() => {})
  }

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })