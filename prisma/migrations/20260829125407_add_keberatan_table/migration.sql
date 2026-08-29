CREATE TABLE "Keberatan" (
    "id" TEXT NOT NULL,
    "nomorTiket" TEXT,
    "nomorPendaftaran" TEXT NOT NULL,
    "tujuanPenggunaan" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "alamat" TEXT,
    "pekerjaan" TEXT,
    "email" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "kuasaNama" TEXT,
    "kuasaAlamat" TEXT,
    "kuasaTelepon" TEXT,
    "alasanA" BOOLEAN NOT NULL DEFAULT false,
    "alasanB" BOOLEAN NOT NULL DEFAULT false,
    "alasanC" BOOLEAN NOT NULL DEFAULT false,
    "alasanD" BOOLEAN NOT NULL DEFAULT false,
    "alasanE" BOOLEAN NOT NULL DEFAULT false,
    "alasanF" BOOLEAN NOT NULL DEFAULT false,
    "alasanG" BOOLEAN NOT NULL DEFAULT false,
    "kasusPosisi" TEXT NOT NULL,
    "tandaTangan" TEXT NOT NULL,
    "status" "StatusPermohonan" NOT NULL DEFAULT 'PENDING',
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keberatan_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Keberatan_nomorTiket_key" ON "Keberatan"("nomorTiket");