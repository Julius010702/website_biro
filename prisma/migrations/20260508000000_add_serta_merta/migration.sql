CREATE TABLE IF NOT EXISTS "InformasiSertaMerta" (
  "id"          TEXT NOT NULL,
  "judul"       TEXT NOT NULL,
  "deskripsi"   TEXT,
  "file"        TEXT,
  "gambar"      TEXT,
  "tipe"        TEXT NOT NULL DEFAULT 'DOKUMEN',
  "urlSosmed"   TEXT,
  "aktif"       BOOLEAN NOT NULL DEFAULT true,
  "urutan"      INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InformasiSertaMerta_pkey" PRIMARY KEY ("id")
);
