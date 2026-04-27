-- CreateEnum
CREATE TYPE "TipeInformasiPublik" AS ENUM ('GAMBAR', 'DOKUMEN', 'GAMBAR_DOKUMEN');

-- CreateTable
CREATE TABLE "informasi_publik" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kategori" TEXT,
    "tipe" "TipeInformasiPublik" NOT NULL DEFAULT 'GAMBAR',
    "url" TEXT,
    "urlDokumen" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "informasi_publik_pkey" PRIMARY KEY ("id")
);
