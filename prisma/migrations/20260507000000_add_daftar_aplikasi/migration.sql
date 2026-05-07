CREATE TABLE IF NOT EXISTS "DaftarAplikasi" (
  "id" TEXT NOT NULL,
  "nama" TEXT NOT NULL,
  "deskripsi" TEXT,
  "href" TEXT NOT NULL,
  "kategori" TEXT,
  "logo" TEXT,
  "urutan" INTEGER NOT NULL DEFAULT 0,
  "aktif" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DaftarAplikasi_pkey" PRIMARY KEY ("id")
);
