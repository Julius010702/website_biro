-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "BagianSlug" AS ENUM ('KELEMBAGAAN_ANALISIS_JABATAN', 'REFORMASI_BIROKRASI_AKUNTABILITAS', 'TATA_LAKSANA');

-- CreateEnum
CREATE TYPE "StatusPermohonan" AS ENUM ('PENDING', 'DIPROSES', 'SELESAI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "TipeGaleri" AS ENUM ('FOTO', 'VIDEO');

-- CreateEnum
CREATE TYPE "TipePeraturan" AS ENUM ('UNDANG_UNDANG', 'PERATURAN_PEMERINTAH', 'PERATURAN_PRESIDEN', 'PERATURAN_KEMENDAGRI', 'PERATURAN_KEMENPANRB', 'PERATURAN_DAERAH', 'PERATURAN_GUBERNUR', 'KEPUTUSAN_GUBERNUR');

-- CreateEnum
CREATE TYPE "KategoriPPID" AS ENUM ('REGULASI', 'TUGAS_FUNGSI', 'STRUKTUR_ORGANISASI', 'MAKLUMAT', 'DOKUMEN_ANGGARAN', 'PROSEDUR_BENCANA', 'SK_DIKECUALIKAN', 'SK_DAFTAR_INFORMASI', 'DAFTAR_INFORMASI');

-- CreateEnum
CREATE TYPE "StatusPengaduan" AS ENUM ('BARU', 'DIVERIFIKASI', 'DIPROSES', 'SELESAI', 'DITUTUP');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SliderBeranda" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "gambar" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SliderBeranda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatistikBeranda" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "ikon" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatistikBeranda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SekapurSirih" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "foto" TEXT,
    "jabatan" TEXT,
    "nama" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SekapurSirih_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrukturOrganisasi" (
    "id" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "deskripsi" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrukturOrganisasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TugasPokokFungsi" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TugasPokokFungsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bagian" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" "BagianSlug" NOT NULL,
    "deskripsi" TEXT,
    "konten" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bagian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DokumenSAKIP" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "file" TEXT NOT NULL,
    "kategori" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DokumenSAKIP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NilaiSKM" (
    "id" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "predikat" TEXT NOT NULL,
    "keterangan" TEXT,
    "file" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NilaiSKM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaklumatPelayanan" (
    "id" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "gambar" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaklumatPelayanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandarPelayanan" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "file" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandarPelayanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DasbordGrafik" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "deskripsi" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DasbordGrafik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenyederhanaanBirokrasi" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "file" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenyederhanaanBirokrasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedomanZonaIntegritas" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "file" TEXT,
    "gambar" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PedomanZonaIntegritas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PakaianDinas" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "deskripsi" TEXT,
    "jenis" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PakaianDinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermintaanDataTPPASN" (
    "id" TEXT NOT NULL,
    "namaPemohon" TEXT NOT NULL,
    "nip" TEXT,
    "instansi" TEXT NOT NULL,
    "keperluan" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" "StatusPermohonan" NOT NULL DEFAULT 'PENDING',
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermintaanDataTPPASN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Berita" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "ringkasan" TEXT,
    "gambar" TEXT,
    "kategori" TEXT,
    "tags" TEXT[],
    "penulis" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kegiatan" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "ringkasan" TEXT,
    "gambar" TEXT,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3),
    "lokasi" TEXT,
    "penyelenggara" TEXT,
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Galeri" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tipe" "TipeGaleri" NOT NULL DEFAULT 'FOTO',
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "tags" TEXT[],
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Galeri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kontak" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT,
    "subjek" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "dibaca" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kontak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformasiKontak" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "ikon" TEXT,
    "tipe" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InformasiKontak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peraturan" (
    "id" TEXT NOT NULL,
    "nomor" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "tentang" TEXT NOT NULL,
    "file" TEXT,
    "tipe" "TipePeraturan" NOT NULL,
    "subTipe" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peraturan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DokumenPPID" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "file" TEXT,
    "kategori" "KategoriPPID" NOT NULL,
    "tahun" INTEGER,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DokumenPPID_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermohonanInformasi" (
    "id" TEXT NOT NULL,
    "namaPemohon" TEXT NOT NULL,
    "nik" TEXT,
    "alamat" TEXT,
    "telepon" TEXT,
    "email" TEXT,
    "pekerjaan" TEXT,
    "informasiDiminta" TEXT NOT NULL,
    "tujuanPenggunaan" TEXT NOT NULL,
    "caraPenyampaian" TEXT NOT NULL,
    "status" "StatusPermohonan" NOT NULL DEFAULT 'PENDING',
    "nomorRegister" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermohonanInformasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengaduan" (
    "id" TEXT NOT NULL,
    "nomorTiket" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "unitKerja" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "subjek" TEXT NOT NULL,
    "uraian" TEXT NOT NULL,
    "buktiFile" TEXT,
    "status" "StatusPengaduan" NOT NULL DEFAULT 'BARU',
    "tanggapan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengaduan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bagian_slug_key" ON "Bagian"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Berita_slug_key" ON "Berita"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Kegiatan_slug_key" ON "Kegiatan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PermohonanInformasi_nomorRegister_key" ON "PermohonanInformasi"("nomorRegister");

-- CreateIndex
CREATE UNIQUE INDEX "Pengaduan_nomorTiket_key" ON "Pengaduan"("nomorTiket");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_key_key" ON "SiteSettings"("key");
