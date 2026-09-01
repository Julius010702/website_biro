# ============================================================================
# apply-notifikasi.ps1 (v3 - LiteralPath konsisten di New-Item & Set-Content)
# Sistem notifikasi admin: Keberatan, Permohonan, Berita (share counter)
# + perbaikan admin Keberatan agar sesuai skema Keberatan yang sebenarnya
# Jalankan dari root project: D:\my-project\website_biro
# ============================================================================

$ErrorActionPreference = "Stop"
Write-Host "==> Menulis file..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "prisma" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "prisma/schema.prisma" -Encoding UTF8 -Value @'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SliderBeranda {
  id        String   @id @default(cuid())
  judul     String
  deskripsi String?
  gambar    String
  urutan    Int      @default(0)
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model StatistikBeranda {
  id        String   @id @default(cuid())
  label     String
  nilai     String
  ikon      String?
  urutan    Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SekapurSirih {
  id        String   @id @default(cuid())
  judul     String
  konten    String
  foto      String?
  jabatan   String?
  nama      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model StrukturOrganisasi {
  id        String   @id @default(cuid())
  gambar    String
  deskripsi String?
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tipe      String   @default("BIRO")
}

model TugasPokokFungsi {
  id        String   @id @default(cuid())
  judul     String
  konten    String
  urutan    Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Bagian {
  id        String     @id @default(cuid())
  nama      String
  slug      BagianSlug @unique
  deskripsi String?
  konten    String?
  urutan    Int        @default(0)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model DokumenSAKIP {
  id        String   @id @default(cuid())
  judul     String
  tahun     Int
  file      String
  kategori  String?
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model NilaiSKM {
  id         String   @id @default(cuid())
  tahun      Int
  semester   Int
  nilai      Float
  predikat   String
  keterangan String?
  file       String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model MaklumatPelayanan {
  id        String   @id @default(cuid())
  konten    String
  gambar    String?
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model StandarPelayanan {
  id        String   @id @default(cuid())
  judul     String
  deskripsi String?
  file      String?
  urutan    Int      @default(0)
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model DasbordGrafik {
  id        String   @id @default(cuid())
  judul     String
  tipe      String
  data      Json
  deskripsi String?
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PenyederhanaanBirokrasi {
  id        String   @id @default(cuid())
  judul     String
  konten    String
  file      String?
  urutan    Int      @default(0)
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PedomanZonaIntegritas {
  id        String   @id @default(cuid())
  judul     String
  konten    String
  file      String?
  gambar    String?
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PakaianDinas {
  id        String   @id @default(cuid())
  judul     String
  gambar    String
  deskripsi String?
  jenis     String
  urutan    Int      @default(0)
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SitusTerkait {
  id        String   @id @default(cuid())
  label     String
  href      String
  external  Boolean  @default(true)
  thumbnail String[]
  favicon   String?
  aktif     Boolean  @default(true)
  urutan    Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PermintaanDataTPPASN {
  id          String           @id @default(cuid())
  namaPemohon String
  nip         String?
  instansi    String
  keperluan   String
  tanggal     DateTime
  status      StatusPermohonan @default(PENDING)
  keterangan  String?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model Berita {
  id        String    @id @default(cuid())
  judul     String
  slug      String    @unique
  konten    String
  ringkasan String?
  gambar    String?
  kategori  String?
  tags      String[]
  penulis   String?
  views     Int       @default(0)
  publish   Boolean   @default(false)
  publishAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  video     String?
  shares    Int       @default(0)
}

model Kegiatan {
  id             String    @id @default(cuid())
  judul          String
  slug           String    @unique
  konten         String
  ringkasan      String?
  gambar         String?
  tanggalMulai   DateTime
  tanggalSelesai DateTime?
  lokasi         String?
  penyelenggara  String?
  publish        Boolean   @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Galeri {
  id        String     @id @default(cuid())
  judul     String
  deskripsi String?
  tipe      TipeGaleri @default(FOTO)
  url       String
  thumbnail String?
  tags      String[]
  urutan    Int        @default(0)
  aktif     Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Kontak {
  id        String   @id @default(cuid())
  nama      String
  email     String
  telepon   String?
  subjek    String
  pesan     String
  dibaca    Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model InformasiKontak {
  id        String   @id @default(cuid())
  nama      String
  nilai     String
  ikon      String?
  tipe      String
  urutan    Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Peraturan {
  id        String        @id @default(cuid())
  nomor     String
  judul     String
  tahun     Int
  tentang   String
  file      String?
  tipe      TipePeraturan
  subTipe   String?
  aktif     Boolean       @default(true)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model SeputarPPID {
  id        String   @id @default(cuid())
  judul     String
  konten    String
  nama      String?
  jabatan   String?
  foto      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TugasFungsiPPID {
  id        String   @id @default(cuid())
  judul     String
  konten    String
  urutan    Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model DokumenPPID {
  id        String       @id @default(cuid())
  judul     String
  deskripsi String?
  file      String?
  kategori  KategoriPPID
  tahun     Int?
  aktif     Boolean      @default(true)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
}

model PermohonanInformasi {
  id               String           @id @default(cuid())
  namaPemohon      String
  nik              String?
  alamat           String?
  telepon          String?
  email            String?
  pekerjaan        String?
  informasiDiminta String
  tujuanPenggunaan String
  caraPenyampaian  String
  status           StatusPermohonan @default(PENDING)
  nomorRegister    String?          @unique
  keterangan       String?
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
}

model Keberatan {
  id               String           @id @default(cuid())
  nomorTiket       String?          @unique
  nomorPendaftaran String
  tujuanPenggunaan String
  namaLengkap      String
  alamat           String?
  pekerjaan        String?
  email            String
  telepon          String
  kuasaNama        String?
  kuasaAlamat      String?
  kuasaTelepon     String?
  alasanA          Boolean          @default(false)
  alasanB          Boolean          @default(false)
  alasanC          Boolean          @default(false)
  alasanD          Boolean          @default(false)
  alasanE          Boolean          @default(false)
  alasanF          Boolean          @default(false)
  alasanG          Boolean          @default(false)
  kasusPosisi      String
  tandaTangan      String
  status           StatusPermohonan @default(PENDING)
  keterangan       String?
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
}

model Pengaduan {
  id         String          @id @default(cuid())
  nomorTiket String          @unique
  nama       String
  nip        String
  unitKerja  String
  kategori   String
  subjek     String
  uraian     String
  buktiFile  String?
  status     StatusPengaduan @default(BARU)
  tanggapan  String?
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
}

model SiteSettings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  label     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model InformasiPublik {
  id         String              @id @default(cuid())
  judul      String
  deskripsi  String?
  kategori   String?
  tipe       TipeInformasiPublik @default(GAMBAR)
  url        String?
  urlDokumen String?
  urutan     Int                 @default(0)
  aktif      Boolean             @default(true)
  createdAt  DateTime            @default(now())
  updatedAt  DateTime            @updatedAt

  @@map("informasi_publik")
}

model DaftarAplikasi {
  id        String   @id @default(cuid())
  nama      String
  deskripsi String?
  href      String
  kategori  String?
  logo      String?
  urutan    Int      @default(0)
  aktif     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model InformasiSertaMerta {
  id        String   @id @default(cuid())
  judul     String
  deskripsi String?
  file      String?
  gambar    String?
  tipe      String   @default("DOKUMEN")
  urlSosmed String?
  aktif     Boolean  @default(true)
  urutan    Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Notifikasi {
  id        String         @id @default(cuid())
  tipe      TipeNotifikasi
  judul     String
  pesan     String
  link      String?
  dibaca    Boolean        @default(false)
  createdAt DateTime       @default(now())
}

enum Role {
  SUPERADMIN
  ADMIN
  EDITOR
}

enum BagianSlug {
  KELEMBAGAAN_ANALISIS_JABATAN
  REFORMASI_BIROKRASI_AKUNTABILITAS
  TATA_LAKSANA
}

enum StatusPermohonan {
  PENDING
  DIPROSES
  SELESAI
  DITOLAK
}

enum TipeGaleri {
  FOTO
  VIDEO
}

enum TipePeraturan {
  UNDANG_UNDANG
  PERATURAN_PEMERINTAH
  PERATURAN_PRESIDEN
  PERATURAN_KEMENDAGRI
  PERATURAN_KEMENPANRB
  PERATURAN_DAERAH
  PERATURAN_GUBERNUR
  KEPUTUSAN_GUBERNUR
}

enum KategoriPPID {
  REGULASI
  TUGAS_FUNGSI
  STRUKTUR_ORGANISASI
  MAKLUMAT
  DOKUMEN_ANGGARAN
  PROSEDUR_BENCANA
  SK_DIKECUALIKAN
  SK_DAFTAR_INFORMASI
  DAFTAR_INFORMASI
}

enum StatusPengaduan {
  BARU
  DIVERIFIKASI
  DIPROSES
  SELESAI
  DITUTUP
}

enum TipeInformasiPublik {
  GAMBAR
  DOKUMEN
  GAMBAR_DOKUMEN
}

enum TipeNotifikasi {
  KEBERATAN
  PERMOHONAN
  KONTAK
  BERITA_SHARE
}
'@
Write-Host "  - prisma/schema.prisma" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/lib" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/lib/notifikasi.ts" -Encoding UTF8 -Value @'
// app/lib/notifikasi.ts
import { prisma } from '@/lib/prisma'

export type TipeNotifikasi = 'KEBERATAN' | 'PERMOHONAN' | 'KONTAK' | 'BERITA_SHARE'

/**
 * Buat entri notifikasi baru untuk admin.
 * Sengaja dibungkus try/catch supaya kegagalan mencatat notifikasi
 * TIDAK menggagalkan proses utama (mis. submit formulir publik).
 */
export async function buatNotifikasi(data: {
  tipe: TipeNotifikasi
  judul: string
  pesan: string
  link?: string
}) {
  try {
    await prisma.notifikasi.create({
      data: {
        tipe:  data.tipe,
        judul: data.judul,
        pesan: data.pesan,
        link:  data.link ?? null,
      },
    })
  } catch (e) {
    console.error('[buatNotifikasi] gagal membuat notifikasi:', e)
  }
}
'@
Write-Host "  - app/lib/notifikasi.ts" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/actions" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/actions/ppid.ts" -Encoding UTF8 -Value @'
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
'@
Write-Host "  - app/actions/ppid.ts" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/api/ppid/permohonan" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/api/ppid/permohonan/route.ts" -Encoding UTF8 -Value @'
// app/api/ppid/permohonan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateRegisterNumber } from '@/lib/utils'
import { buatNotifikasi } from '@/lib/notifikasi'

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

    await buatNotifikasi({
      tipe:  'PERMOHONAN',
      judul: 'Permohonan Informasi Baru',
      pesan: `${body.namaPemohon} mengajukan permohonan informasi publik (No. ${nomorRegister}).`,
      link:  '/admin/ppid/permohonan',
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
'@
Write-Host "  - app/api/ppid/permohonan/route.ts" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/api/berita/[slug]/share" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/api/berita/[slug]/share/route.ts" -Encoding UTF8 -Value @'
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
'@
Write-Host "  - app/api/berita/[slug]/share/route.ts" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/components/shared" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/components/shared/ShareButton.tsx" -Encoding UTF8 -Value @'
'use client'
import { useState } from 'react'
import { Share2, Link2, Check, MessageCircle, Mail } from 'lucide-react'

export default function ShareButton({ title, url, slug }: { title: string; url: string; slug?: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== 'undefined' ? window.location.href : url

  function trackShare() {
    if (!slug) return
    fetch(`/api/berita/${slug}/share`, { method: 'POST' }).catch(() => {})
  }

  function copyLink() {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    trackShare()
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShareClick() {
    trackShare()
    setOpen(false)
  }

  const shareLinks = [
    {
      label: 'Facebook',
      color: '#1877F2',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'Twitter/X',
      color: '#000000',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'WhatsApp',
      color: '#25D366',
      icon: <MessageCircle className="w-4 h-4" />,
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + fullUrl)}`,
    },
    {
      label: 'Telegram',
      color: '#0088CC',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
      url: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: 'Instagram',
      color: '#E1306C',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.0148.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
      url: `https://www.instagram.com/`,
    },
    {
      label: 'TikTok',
      color: '#000000',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.340 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>,
      url: `https://www.tiktok.com/`,
    },
    {
      label: 'LinkedIn',
      color: '#0A66C2',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'Email',
      color: '#EA4335',
      icon: <Mail className="w-4 h-4" />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(title + '\n\n' + fullUrl)}`,
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
        style={{ background: open ? '#EFF6FF' : 'white', color: open ? '#0D47A1' : '#64748B', border: '1px solid ' + (open ? '#DBEAFE' : '#E2E8F0') }}
      >
        <Share2 className="w-3.5 h-3.5" /> Bagikan
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-12 z-50 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'white', border: '1px solid #DBEAFE', minWidth: 190 }}>
            <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}>
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#94A3B8' }}>Bagikan ke</p>
            </div>
            <div className="flex flex-col max-h-72 overflow-y-auto">
              {shareLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  style={{ textDecoration: 'none' }}
                  onClick={handleShareClick}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
                    style={{ background: s.color }}>
                    {s.icon}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: '#374151' }}>{s.label}</span>
                </a>
              ))}
              <button onClick={copyLink}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors w-full text-left"
                style={{ borderTop: '1px solid #EEF3FC' }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: copied ? '#ECFDF5' : '#F1F5F9' }}>
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4 text-slate-500" />}
                </span>
                <span className="text-xs font-semibold" style={{ color: copied ? '#065F46' : '#374151' }}>
                  {copied ? 'Link disalin!' : 'Salin Link'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
'@
Write-Host "  - app/components/shared/ShareButton.tsx" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/(main)/berita/[slug]" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/(main)/berita/[slug]/page.tsx" -Encoding UTF8 -Value @'
// app/(public)/berita/[slug]/page.tsx
import { prisma }        from '@/lib/prisma'
import { notFound }      from 'next/navigation'
import Link              from 'next/link'
import Image             from 'next/image'
import type { Metadata } from 'next'
import { format }        from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import {
  Clock, Eye, Tag, ChevronRight,
  ArrowLeft, Newspaper, Share2,
} from 'lucide-react'
import BeritaImage, { GambarPlaceholder } from '@/components/shared/BeritaImage'
import ShareButton from '@/components/shared/ShareButton'
import VideoPlayer from '@/components/shared/VideoPlayer'
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const berita = await prisma.berita.findUnique({
    where:  { slug, publish: true },
    select: { judul: true, ringkasan: true, gambar: true },
  })
  if (!berita) return { title: 'Berita Tidak Ditemukan' }
  return {
    title:       berita.judul,
    description: berita.ringkasan ?? berita.judul,
    openGraph: {
      title:       berita.judul,
      description: berita.ringkasan ?? '',
      images:      berita.gambar ? [berita.gambar] : [],
    },
  }
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const berita = await prisma.berita.findUnique({
    where: { slug, publish: true },
  })
  if (!berita) notFound()

  prisma.berita.update({
    where: { id: berita.id },
    data:  { views: { increment: 1 } },
  }).catch(() => {})

  const terkait = await prisma.berita.findMany({
    where: {
      publish: true,
      id:      { not: berita.id },
      ...(berita.kategori ? { kategori: berita.kategori } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take:    4,
    select:  { id: true, judul: true, slug: true, gambar: true, createdAt: true, kategori: true },
  })

  return (
    <main style={{ background: '#F4F7FD', minHeight: '100vh' }}>

      {/* ── Hero gambar ── */}
      {berita.gambar && (
        <div className="relative w-full overflow-hidden" style={{ height: '420px' }}>
          <Image
            src={berita.gambar}
            alt={berita.judul}
            fill priority sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.90) 0%, rgba(10,35,66,0.45) 55%, transparent 100%)' }}
          />
          <div className="absolute top-0 left-0 right-0 px-4 py-4">
            <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-white/60">
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-white/90">Beranda</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/berita" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-white/90">Berita</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/80 truncate max-w-48">{berita.judul}</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
            <div className="max-w-4xl mx-auto">
              {berita.kategori && (
                <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg mb-3" style={{ background: '#F5A623', color: '#0A2342' }}>
                  {berita.kategori}
                </span>
              )}
              <h1
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {berita.judul}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Breadcrumb (jika tidak ada gambar) ── */}
        {!berita.gambar && (
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-blue-600">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/berita" style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-blue-600">Berita</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 truncate">{berita.judul}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Artikel utama ── */}
          <article className="lg:col-span-2 flex flex-col gap-5">

            {/* Judul (jika tidak ada gambar) */}
            {!berita.gambar && (
              <h1
                className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}
              >
                {berita.judul}
              </h1>
            )}

            {/* Meta info */}
            <div
              className="flex flex-wrap items-center gap-3 py-3 text-xs text-slate-400"
              style={{ borderTop: '1px solid #EEF3FC', borderBottom: '1px solid #EEF3FC' }}
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {format(new Date(berita.createdAt), "d MMMM yyyy, HH.mm 'WITA'", { locale: localeId })}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {(berita.views + 1).toLocaleString()} kali dibaca
              </span>
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                {berita.shares.toLocaleString()} kali dibagikan
              </span>
              {berita.penulis && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  Oleh: <strong className="text-slate-500">{berita.penulis}</strong>
                </span>
              )}
            </div>

            {/* Ringkasan */}
            {berita.ringkasan && (
              <div
                className="p-4 rounded-xl text-sm leading-relaxed font-medium italic"
                style={{ background: '#EFF6FF', borderLeft: '3px solid #0D47A1', color: '#1E3A5F' }}
              >
                {berita.ringkasan}
              </div>
            )}

            {/* ✅ Video Player — tampil di atas konten jika ada video */}
            {berita.video && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{ background: '#FF0000' }}
                  />
                  <span className="text-xs font-bold" style={{ color: '#0A2342' }}>
                    Video
                  </span>
                </div>
                <VideoPlayer url={berita.video} />
              </div>
            )}

            {/* Konten artikel */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: 'white', border: '1px solid #DBEAFE' }}
            >
              <div
                className="prose prose-sm sm:prose max-w-none"
                style={{ color: '#374151' }}
                dangerouslySetInnerHTML={{ __html: berita.konten }}
              />
            </div>

            {/* Tags */}
            {berita.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {berita.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/berita?q=${encodeURIComponent(tag)}`}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:scale-105"
                    style={{ background: '#EFF6FF', color: '#1565C0', border: '1px solid #DBEAFE', textDecoration: 'none' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Nav bawah */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
                style={{ background: 'white', color: '#0D47A1', border: '1px solid #DBEAFE' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Semua Berita
              </Link>
              <ShareButton title={berita.judul} url={`/berita/${berita.slug}`} slug={berita.slug} />
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-5">
            <div
              className="rounded-2xl overflow-hidden sticky top-24"
              style={{ background: 'white', border: '1px solid #DBEAFE' }}
            >
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #0A2342, #0D47A1)', borderBottom: '1px solid #DBEAFE' }}
              >
                <Newspaper className="w-4 h-4 text-yellow-400" />
                <h2 className="text-xs font-bold text-white">Berita Terkait</h2>
              </div>

              {terkait.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-slate-400">Tidak ada berita terkait.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {terkait.map((t) => (
                    <Link
                      key={t.id}
                      href={`/berita/${t.slug}`}
                      className="group flex gap-3 p-3.5 hover:bg-slate-50 transition-colors"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        {t.gambar
                          ? <BeritaImage src={t.gambar} alt={t.judul} fill sizes="64px" className="object-cover" />
                          : <GambarPlaceholder size="sm" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold leading-snug line-clamp-3 mb-1 transition-colors group-hover:text-blue-700"
                          style={{ color: '#0A2342' }}
                        >
                          {t.judul}
                        </p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {format(new Date(t.createdAt), 'd MMM yyyy', { locale: localeId })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="p-3" style={{ borderTop: '1px solid #EEF3FC' }}>
                <Link
                  href="/berita"
                  className="block text-center text-xs font-semibold py-2.5 rounded-xl transition-all hover:scale-105"
                  style={{ background: '#EFF6FF', color: '#0D47A1' }}
                >
                  Lihat Semua Berita →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
'@
Write-Host "  - app/(main)/berita/[slug]/page.tsx" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/components/(admin)" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/components/(admin)/AdminHeader.tsx" -Encoding UTF8 -Value @'
'use client'
// components/admin/AdminHeader.tsx
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, ExternalLink } from 'lucide-react'
import type { SessionUser } from '@/lib/auth'
import NotificationBell from './NotificationBell'

interface AdminHeaderProps {
  user: SessionUser
}

const PPID_PERMOHONAN_URL = 'http://ppidutama.nttprov.go.id'

const pathTitles: Record<string, string> = {
  '/admin':                                   'Dashboard',
  '/admin/profil/sekapur-sirih':              'Tentang Kami',
  '/admin/profil/struktur-organisasi':        'Struktur Organisasi',
  '/admin/profil/tupoksi':                    'Tugas Pokok & Fungsi',
  '/admin/profil/bagian':                     'Bagian',
  '/admin/beranda/slider':                    'Slider Beranda',
  '/admin/beranda/statistik':                 'Statistik Beranda',
  '/admin/berita':                            'Berita',
  '/admin/kegiatan':                          'Kegiatan',
  '/admin/galeri':                            'Galeri',
  // ── PPID ──────────────────────────────────────────────────────────────────
  '/admin/ppid/seputar':                      'Seputar PPID',
  '/admin/ppid/tugas-fungsi':                 'Tugas & Fungsi PPID',
  '/admin/ppid/struktur-organisasi':          'Struktur Organisasi PPID',
  '/admin/ppid/maklumat':                     'Maklumat Pelayanan',
  '/admin/ppid/pelayanan':                    'Pelayanan Informasi',
  '/admin/ppid/dokumen':                      'Daftar Informasi',
  '/admin/ppid/permohonan':                   'Permohonan Informasi',
  '/admin/ppid/prosedur-bencana':             'Prosedur Bencana',
  // ── Lainnya ───────────────────────────────────────────────────────────────
  '/admin/kontak':                            'Pesan Kontak',
  '/admin/pengaduan':                         'Pengaduan (WBS)',
  '/admin/pengaturan':                        'Pengaturan Situs',
}

/** Routes that should open an external URL instead of rendering a local page */
const externalRoutes: Record<string, string> = {
  '/admin/ppid/permohonan': PPID_PERMOHONAN_URL,
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname()
  const router   = useRouter()

  const matchedEntry = Object.entries(pathTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))

  const title       = matchedEntry?.[1] ?? 'Admin'
  const matchedPath = matchedEntry?.[0] ?? ''
  const externalUrl = externalRoutes[matchedPath]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-3 shrink-0"
      style={{
        background: 'white',
        borderBottom: '1px solid #E2EAF6',
        boxShadow: '0 1px 4px rgba(13,71,161,0.06)',
      }}
    >
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94A3B8' }}>
          Panel Admin
        </p>
        <div className="flex items-center gap-2">
          <h1
            className="text-base font-bold"
            style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h1>

          {/* External link badge — shown only on pages mapped to an external URL */}
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#1D4ED8',
                textDecoration: 'none',
              }}
              title={`Buka ${externalUrl}`}
            >
              <ExternalLink className="w-3 h-3" />
              Buka Website
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User chip */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: '#F8FAFF', border: '1px solid #DBEAFE' }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
            style={{ background: 'linear-gradient(135deg,#0D47A1,#1565C0)', color: 'white' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-none truncate" style={{ color: '#0A2342' }}>
              {user.name}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>
              {user.role}
            </p>
          </div>
        </div>

        <NotificationBell />

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
        >
          <LogOut className="w-3.5 h-3.5" /> Keluar
        </button>
      </div>
    </header>
  )
}
'@
Write-Host "  - app/components/(admin)/AdminHeader.tsx" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/components/(admin)" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/components/(admin)/NotificationBell.tsx" -Encoding UTF8 -Value @'
'use client'
// app/components/(admin)/NotificationBell.tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, ScrollText, MessageSquare, Mail, Share2, CheckCheck } from 'lucide-react'

type TipeNotifikasi = 'KEBERATAN' | 'PERMOHONAN' | 'KONTAK' | 'BERITA_SHARE'

type Notifikasi = {
  id: string
  tipe: TipeNotifikasi
  judul: string
  pesan: string
  link: string | null
  dibaca: boolean
  createdAt: string
}

const TIPE_ICON: Record<TipeNotifikasi, React.ReactNode> = {
  KEBERATAN:    <ScrollText    className="w-4 h-4" />,
  PERMOHONAN:   <MessageSquare className="w-4 h-4" />,
  KONTAK:       <Mail          className="w-4 h-4" />,
  BERITA_SHARE: <Share2        className="w-4 h-4" />,
}

const TIPE_COLOR: Record<TipeNotifikasi, { color: string; bg: string }> = {
  KEBERATAN:    { color: '#DC2626', bg: '#FFF1F2' },
  PERMOHONAN:   { color: '#0D47A1', bg: '#EFF6FF' },
  KONTAK:       { color: '#7C3AED', bg: '#F5F3FF' },
  BERITA_SHARE: { color: '#065F46', bg: '#ECFDF5' },
}

function waktuRelatif(iso: string) {
  const detik = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (detik < 60) return 'Baru saja'
  const menit = Math.floor(detik / 60)
  if (menit < 60) return `${menit} menit lalu`
  const jam = Math.floor(menit / 60)
  if (jam < 24) return `${jam} jam lalu`
  const hari = Math.floor(jam / 24)
  return `${hari} hari lalu`
}

export default function NotificationBell() {
  const [open, setOpen]          = useState(false)
  const [list, setList]          = useState<Notifikasi[]>([])
  const [unreadCount, setUnread] = useState(0)
  const ref                      = useRef<HTMLDivElement>(null)
  const router                   = useRouter()

  const load = useCallback(async () => {
    try {
      const res  = await fetch('/api/admin/notifikasi')
      const data = await res.json()
      setList(data.list ?? [])
      setUnread(data.unreadCount ?? 0)
    } catch {
      // diamkan; polling berikutnya akan coba lagi
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 20000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function markAllRead() {
    setList((prev) => prev.map((n) => ({ ...n, dibaca: true })))
    setUnread(0)
    await fetch('/api/admin/notifikasi', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ markAll: true }),
    }).catch(() => {})
  }

  async function handleClickItem(n: Notifikasi) {
    setOpen(false)
    if (!n.dibaca) {
      setList((prev) => prev.map((x) => (x.id === n.id ? { ...x, dibaca: true } : x)))
      setUnread((c) => Math.max(0, c - 1))
      fetch('/api/admin/notifikasi', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: n.id }),
      }).catch(() => {})
    }
    if (n.link) router.push(n.link)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-blue-50"
        style={{ border: '1px solid #DBEAFE', color: '#64748B' }}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: '#DC2626' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'white', border: '1px solid #DBEAFE', width: 340 }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}
          >
            <p className="text-xs font-bold" style={{ color: '#0A2342' }}>Notifikasi</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 hover:text-blue-900"
              >
                <CheckCheck className="w-3 h-3" /> Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {list.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-6 h-6 mx-auto mb-2 text-slate-200" />
                <p className="text-xs text-slate-400">Belum ada notifikasi.</p>
              </div>
            ) : (
              list.map((n) => {
                const c = TIPE_COLOR[n.tipe]
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClickItem(n)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                    style={{ borderBottom: '1px solid #F1F5F9', background: n.dibaca ? 'white' : '#F8FAFF' }}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: c.bg, color: c.color }}
                    >
                      {TIPE_ICON[n.tipe]}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1.5">
                        {!n.dibaca && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#0D47A1' }} />}
                        <span className="text-xs font-bold truncate" style={{ color: '#0A2342' }}>{n.judul}</span>
                      </span>
                      <span className="block text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">{n.pesan}</span>
                      <span className="block text-[10px] text-slate-300 mt-1">{waktuRelatif(n.createdAt)}</span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
'@
Write-Host "  - app/components/(admin)/NotificationBell.tsx" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/api/admin/notifikasi" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/api/admin/notifikasi/route.ts" -Encoding UTF8 -Value @'
// app/api/admin/notifikasi/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const onlyUnread = req.nextUrl.searchParams.get('unread') === '1'
    const [list, unreadCount] = await Promise.all([
      prisma.notifikasi.findMany({
        where:   onlyUnread ? { dibaca: false } : undefined,
        orderBy: { createdAt: 'desc' },
        take:    30,
      }),
      prisma.notifikasi.count({ where: { dibaca: false } }),
    ])
    return NextResponse.json({ list, unreadCount })
  } catch {
    return NextResponse.json({ error: 'Gagal memuat notifikasi' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.markAll) {
      await prisma.notifikasi.updateMany({ where: { dibaca: false }, data: { dibaca: true } })
      return NextResponse.json({ ok: true })
    }
    if (body.id) {
      await prisma.notifikasi.update({ where: { id: body.id }, data: { dibaca: true } })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'id atau markAll diperlukan' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui notifikasi' }, { status: 500 })
  }
}
'@
Write-Host "  - app/api/admin/notifikasi/route.ts" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/api/admin/ppid/keberatan" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/api/admin/ppid/keberatan/route.ts" -Encoding UTF8 -Value @'
// app/api/admin/ppid/keberatan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { StatusPermohonan } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status') as StatusPermohonan | null
    const data = await prisma.keberatan.findMany({
      where:   status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, keterangan } = await req.json()
    const data = await prisma.keberatan.update({
      where: { id },
      data:  { status, keterangan },
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}
'@
Write-Host "  - app/api/admin/ppid/keberatan/route.ts" -ForegroundColor DarkGray

New-Item -ItemType Directory -Force -Path "app/components/(admin)/ppid/keberatan" -ErrorAction SilentlyContinue | Out-Null
Set-Content -LiteralPath "app/components/(admin)/ppid/keberatan/_KeberatanPage.tsx" -Encoding UTF8 -Value @'
'use client'
// app/components/(admin)/ppid/keberatan/_KeberatanPage.tsx
import { useCallback, useEffect, useState, useTransition } from 'react'
import Image from 'next/image'

import {
  AdminCard, AdminCardHeader, AdminTable, AdminTr, AdminTd,
  BtnPrimary, BtnSecondary, FormField, Textarea, Select,
  EmptyState, useToast,
} from '@/components/admin/AdminUI'
import { alasanKeberatanOptions } from '@/lib/navigation'

type StatusPermohonan = 'PENDING' | 'DIPROSES' | 'SELESAI' | 'DITOLAK'

type Keberatan = {
  id: string
  nomorTiket: string | null
  nomorPendaftaran: string
  tujuanPenggunaan: string
  namaLengkap: string
  alamat: string | null
  pekerjaan: string | null
  email: string
  telepon: string
  kuasaNama: string | null
  kuasaAlamat: string | null
  kuasaTelepon: string | null
  alasanA: boolean
  alasanB: boolean
  alasanC: boolean
  alasanD: boolean
  alasanE: boolean
  alasanF: boolean
  alasanG: boolean
  kasusPosisi: string
  tandaTangan: string
  status: StatusPermohonan
  keterangan: string | null
  createdAt: string
}

const STATUS_COLOR: Record<StatusPermohonan, { color: string; bg: string; label: string }> = {
  PENDING:  { color: '#B45309', bg: '#FFFBEB', label: 'Pending' },
  DIPROSES: { color: '#0D47A1', bg: '#EFF6FF', label: 'Diproses' },
  SELESAI:  { color: '#065F46', bg: '#ECFDF5', label: 'Selesai' },
  DITOLAK:  { color: '#DC2626', bg: '#FFF1F2', label: 'Ditolak' },
}

const ALASAN_KEYS = ['alasanA', 'alasanB', 'alasanC', 'alasanD', 'alasanE', 'alasanF', 'alasanG'] as const

function alasanTerpilihLabel(d: Keberatan) {
  return alasanKeberatanOptions
    .filter((opt, i) => d[ALASAN_KEYS[i]])
    .map((opt) => opt.label)
}

export default function KeberatanPage() {
  const [list, setList]       = useState<Keberatan[]>([])
  const [detail, setDetail]   = useState<Keberatan | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [pending, start]      = useTransition()
  const { show, ToastEl }     = useToast()

  const [editStatus, setEditStatus] = useState<StatusPermohonan>('PENDING')
  const [editKet, setEditKet]       = useState('')

  const load = useCallback(() => {
    const qs = filterStatus ? `?status=${filterStatus}` : ''
    fetch(`/api/admin/ppid/keberatan${qs}`).then((r) => r.json()).then(setList)
  }, [filterStatus])

  useEffect(() => { load() }, [load])

  function openDetail(p: Keberatan) {
    setDetail(p)
    setEditStatus(p.status)
    setEditKet(p.keterangan ?? '')
  }

  function handleUpdate() {
    if (!detail) return
    start(async () => {
      try {
        await fetch('/api/admin/ppid/keberatan', {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ id: detail.id, status: editStatus, keterangan: editKet }),
        })
        show('Status keberatan diperbarui')
        setDetail(null); load()
      } catch { show('Terjadi kesalahan', 'error') }
    })
  }

  const badge = (s: StatusPermohonan) => {
    const c = STATUS_COLOR[s]
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: c.bg, color: c.color }}>
        {c.label}
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastEl />

      {/* Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        {(['', 'PENDING', 'DIPROSES', 'SELESAI', 'DITOLAK'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
            style={{
              background: filterStatus === s ? '#0D47A1' : '#EFF6FF',
              color:      filterStatus === s ? 'white'   : '#1565C0',
              border: '1px solid #DBEAFE',
            }}
          >
            {s === '' ? 'Semua' : STATUS_COLOR[s as StatusPermohonan].label}
          </button>
        ))}
      </div>

      <AdminCard>
        <AdminCardHeader title="Pengajuan Keberatan" />
        <AdminTable headers={['No. Tiket', 'Pemohon', 'Alasan', 'Tanggal', 'Status', 'Aksi']}>
          {list.length === 0
            ? <tr><td colSpan={6}><EmptyState label="Belum ada pengajuan keberatan" /></td></tr>
            : list.map((d) => (
              <AdminTr key={d.id}>
                <AdminTd>
                  <span className="text-xs font-mono font-bold" style={{ color: '#0D47A1' }}>
                    {d.nomorTiket ?? '-'}
                  </span>
                </AdminTd>
                <AdminTd>
                  <p className="font-semibold text-sm" style={{ color: '#0A2342' }}>{d.namaLengkap}</p>
                  {d.email && <p className="text-[11px] text-slate-400">{d.email}</p>}
                </AdminTd>
                <AdminTd>
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-xs">
                    {alasanTerpilihLabel(d).join('; ')}
                  </p>
                </AdminTd>
                <AdminTd>
                  <span className="text-xs text-slate-500">
                    {new Date(d.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </AdminTd>
                <AdminTd>{badge(d.status)}</AdminTd>
                <AdminTd>
                  <button
                    onClick={() => openDetail(d)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                    style={{ background: '#EFF6FF', color: '#0D47A1', border: '1px solid #DBEAFE' }}
                  >
                    Kelola
                  </button>
                </AdminTd>
              </AdminTr>
            ))}
        </AdminTable>
      </AdminCard>

      {detail !== null && (
        <AdminCard>
          <AdminCardHeader title={`Kelola Keberatan — ${detail.namaLengkap}`} />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Data Pemohon</p>
              <InfoRow label="No. Tiket"  value={detail.nomorTiket} />
              <InfoRow label="No. Daftar" value={detail.nomorPendaftaran} />
              <InfoRow label="Nama"       value={detail.namaLengkap} />
              <InfoRow label="Alamat"     value={detail.alamat} />
              <InfoRow label="Pekerjaan"  value={detail.pekerjaan} />
              <InfoRow label="Email"      value={detail.email} />
              <InfoRow label="Telepon"    value={detail.telepon} />

              {(detail.kuasaNama || detail.kuasaAlamat || detail.kuasaTelepon) && (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider mt-2" style={{ color: '#94A3B8' }}>Kuasa Pemohon</p>
                  <InfoRow label="Nama"    value={detail.kuasaNama} />
                  <InfoRow label="Alamat"  value={detail.kuasaAlamat} />
                  <InfoRow label="Telepon" value={detail.kuasaTelepon} />
                </>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">Tujuan Penggunaan</p>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{detail.tujuanPenggunaan}</p>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Alasan Keberatan</p>
              <ul className="text-xs text-slate-700 leading-relaxed list-disc pl-4">
                {alasanTerpilihLabel(detail).map((l) => <li key={l}>{l}</li>)}
              </ul>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">Kasus Posisi</p>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{detail.kasusPosisi}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1">Tanda Tangan</p>
                <div className="rounded-lg p-2" style={{ background: '#F8FAFF', border: '1px solid #E2E8F0' }}>
                  <Image src={detail.tandaTangan} alt="Tanda tangan pemohon" width={280} height={100} unoptimized />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 pt-4" style={{ borderTop: '1px solid #EEF3FC' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#94A3B8' }}>Tindak Lanjut</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Ubah Status">
                  <Select value={editStatus} onChange={(e) => setEditStatus(e.target.value as StatusPermohonan)}>
                    <option value="PENDING">Pending</option>
                    <option value="DIPROSES">Diproses</option>
                    <option value="SELESAI">Selesai</option>
                    <option value="DITOLAK">Ditolak</option>
                  </Select>
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Keterangan / Catatan">
                    <Textarea rows={3} value={editKet} onChange={(e) => setEditKet(e.target.value)} placeholder="Catatan tanggapan untuk pemohon…" />
                  </FormField>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: '1px solid #EEF3FC' }}>
            <BtnSecondary onClick={() => setDetail(null)}>Tutup</BtnSecondary>
            <BtnPrimary onClick={handleUpdate} loading={pending}>Simpan Perubahan</BtnPrimary>
          </div>
        </AdminCard>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-2">
      <span className="text-[10px] font-bold w-20 shrink-0 pt-0.5" style={{ color: '#94A3B8' }}>{label}</span>
      <span className="text-xs text-slate-700">{value ?? '-'}</span>
    </div>
  )
}
'@
Write-Host "  - app/components/(admin)/ppid/keberatan/_KeberatanPage.tsx" -ForegroundColor DarkGray

Write-Host "==> Semua file berhasil ditulis." -ForegroundColor Green
Write-Host "==> Membersihkan BOM dari schema.prisma..." -ForegroundColor Cyan
$schemaContent = Get-Content -Raw .\prisma\schema.prisma
[System.IO.File]::WriteAllText("$PWD\prisma\schema.prisma", $schemaContent, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "==> Menyinkronkan skema ke database (db push, aman untuk data)..." -ForegroundColor Cyan
npx prisma db push
npx prisma generate

Write-Host "==> Selesai! Jalankan npm run dev lalu cek lonceng notifikasi di /admin" -ForegroundColor Green
