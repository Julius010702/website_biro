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
