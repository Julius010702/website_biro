'use server'
// app/actions/admin.ts
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import type { BagianSlug, TipePeraturan, KategoriPPID } from '@prisma/client'


export {
  upsertSitusTerkait,
  deleteSitusTerkait,
  toggleAktifSitusTerkait,
  updateUrutanSitusTerkait,
} from './situs-terkait'
 

// ─── Auth guard ───────────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFIL
// ══════════════════════════════════════════════════════════════════════════════

export async function upsertSekapurSirih(data: {
  id?: string; judul: string; konten: string; nama?: string; jabatan?: string; foto?: string
}) {
  await requireAdmin()
  if (data.id) {
    await prisma.sekapurSirih.update({ where: { id: data.id }, data })
  } else {
    await prisma.sekapurSirih.create({ data })
  }
  revalidatePath('/admin/profil/sekapur-sirih')
  revalidatePath('/profil/sekapur-sirih')
}

export async function upsertStrukturOrganisasi(data: {
  id?: string; gambar: string; deskripsi?: string; aktif: boolean
}) {
  await requireAdmin()
  if (data.id) {
    await prisma.strukturOrganisasi.update({ where: { id: data.id }, data })
  } else {
    await prisma.strukturOrganisasi.create({ data })
  }
  revalidatePath('/admin/profil/struktur-organisasi')
  revalidatePath('/profil/struktur-organisasi')
}

export async function deleteStrukturOrganisasi(id: string) {
  await requireAdmin()
  await prisma.strukturOrganisasi.delete({ where: { id } })
  revalidatePath('/admin/profil/struktur-organisasi')
}

export async function upsertTupoksi(data: {
  id?: string; judul: string; konten: string; urutan: number
}) {
  await requireAdmin()
  if (data.id) {
    await prisma.tugasPokokFungsi.update({ where: { id: data.id }, data })
  } else {
    await prisma.tugasPokokFungsi.create({ data })
  }
  revalidatePath('/admin/profil/tupoksi')
  revalidatePath('/profil/tugas-pokok-fungsi')
}

export async function deleteTupoksi(id: string) {
  await requireAdmin()
  await prisma.tugasPokokFungsi.delete({ where: { id } })
  revalidatePath('/admin/profil/tupoksi')
}

export async function upsertBagian(data: {
  id?: string; nama: string; slug: BagianSlug; deskripsi?: string; konten?: string; urutan: number
}) {
  await requireAdmin()
  if (data.id) {
    await prisma.bagian.update({ where: { id: data.id }, data })
  } else {
    await prisma.bagian.create({ data })
  }
  revalidatePath('/admin/profil/bagian')
  revalidatePath('/profil/bagian')
}

// ══════════════════════════════════════════════════════════════════════════════
// BERITA
// ══════════════════════════════════════════════════════════════════════════════

export async function upsertBerita(data: {
  id?: string
  judul: string
  slug: string
  konten: string
  ringkasan?: string
  gambar?: string
  video?: string        // ✅
  kategori?: string
  tags?: string[]
  penulis?: string
  publish: boolean
}) {
  await requireAdmin()
  const { id, tags, ...rest } = data
  const payload = { ...rest, tags: tags ?? [] }
  if (id) {
    await prisma.berita.update({ where: { id }, data: payload })
  } else {
    await prisma.berita.create({ data: payload })
  }
  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath('/')
}

export async function deleteBerita(id: string) {
  await requireAdmin()
  await prisma.berita.delete({ where: { id } })
  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath('/')
}

export async function togglePublishBerita(id: string, publish: boolean) {
  await requireAdmin()
  await prisma.berita.update({ where: { id }, data: { publish } })
  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath('/')
}

// ══════════════════════════════════════════════════════════════════════════════
// KEGIATAN
// ══════════════════════════════════════════════════════════════════════════════

export async function upsertKegiatan(data: {
  id?: string; judul: string; slug: string; konten: string
  ringkasan?: string; gambar?: string; tanggalMulai: Date
  tanggalSelesai?: Date; lokasi?: string; penyelenggara?: string; publish: boolean
}) {
  await requireAdmin()
  const { id, ...rest } = data
  if (id) {
    await prisma.kegiatan.update({ where: { id }, data: rest })
  } else {
    await prisma.kegiatan.create({ data: rest })
  }
  revalidatePath('/admin/kegiatan')
}

export async function deleteKegiatan(id: string) {
  await requireAdmin()
  await prisma.kegiatan.delete({ where: { id } })
  revalidatePath('/admin/kegiatan')
}

// ══════════════════════════════════════════════════════════════════════════════
// GALERI
// ══════════════════════════════════════════════════════════════════════════════

export async function upsertGaleri(data: {
  id?: string; judul: string; deskripsi?: string
  tipe: 'FOTO' | 'VIDEO'; url: string; thumbnail?: string
  tags?: string[]; urutan: number; aktif: boolean
}) {
  await requireAdmin()
  const { id, tags, ...rest } = data
  const payload = { ...rest, tags: tags ?? [] }
  if (id) {
    await prisma.galeri.update({ where: { id }, data: payload })
  } else {
    await prisma.galeri.create({ data: payload })
  }
  revalidatePath('/admin/galeri')
}

export async function deleteGaleri(id: string) {
  await requireAdmin()
  await prisma.galeri.delete({ where: { id } })
  revalidatePath('/admin/galeri')
}

// ══════════════════════════════════════════════════════════════════════════════
// PPID
// ══════════════════════════════════════════════════════════════════════════════

export async function upsertDokumenPPID(data: {
  id?: string; judul: string; deskripsi?: string; file?: string
  kategori: KategoriPPID; tahun?: number; aktif: boolean
}) {
  await requireAdmin()
  const { id, ...rest } = data
  if (id) {
    await prisma.dokumenPPID.update({ where: { id }, data: rest })
  } else {
    await prisma.dokumenPPID.create({ data: rest })
  }
  revalidatePath('/admin/ppid/dokumen')
}

export async function deleteDokumenPPID(id: string) {
  await requireAdmin()
  await prisma.dokumenPPID.delete({ where: { id } })
  revalidatePath('/admin/ppid/dokumen')
}

export async function updateStatusPermohonan(id: string, status: string, keterangan?: string) {
  await requireAdmin()
  await prisma.permohonanInformasi.update({
    where: { id },
    data: { status: status as never, keterangan },
  })
  revalidatePath('/admin/ppid/permohonan')
}

// ══════════════════════════════════════════════════════════════════════════════
// REGULASI
// ══════════════════════════════════════════════════════════════════════════════

export async function upsertPeraturan(data: {
  id?: string; nomor: string; judul: string; tahun: number
  tentang: string; file?: string; tipe: TipePeraturan
  subTipe?: string; aktif: boolean
}) {
  await requireAdmin()
  const { id, ...rest } = data
  if (id) {
    await prisma.peraturan.update({ where: { id }, data: rest })
  } else {
    await prisma.peraturan.create({ data: rest })
  }
  revalidatePath('/admin/regulasi')
}

export async function deletePeraturan(id: string) {
  await requireAdmin()
  await prisma.peraturan.delete({ where: { id } })
  revalidatePath('/admin/regulasi')
}

// ══════════════════════════════════════════════════════════════════════════════
// KONTAK
// ══════════════════════════════════════════════════════════════════════════════

export async function tandaiDibacaKontak(id: string) {
  await requireAdmin()
  await prisma.kontak.update({ where: { id }, data: { dibaca: true } })
  revalidatePath('/admin/kontak')
}

export async function deleteKontak(id: string) {
  await requireAdmin()
  await prisma.kontak.delete({ where: { id } })
  revalidatePath('/admin/kontak')
}

// ══════════════════════════════════════════════════════════════════════════════
// PENGADUAN
// ══════════════════════════════════════════════════════════════════════════════

export async function updateStatusPengaduan(id: string, status: string, tanggapan?: string) {
  await requireAdmin()
  await prisma.pengaduan.update({
    where: { id },
    data: { status: status as never, tanggapan },
  })
  revalidatePath('/admin/pengaduan')
}

export async function deletePengaduan(id: string) {
  await requireAdmin()
  await prisma.pengaduan.delete({ where: { id } })
  revalidatePath('/admin/pengaduan')
}

// ══════════════════════════════════════════════════════════════════════════════
// PENGATURAN
// ══════════════════════════════════════════════════════════════════════════════

export async function upsertSiteSetting(key: string, value: string, label?: string) {
  await requireAdmin()
  await prisma.siteSettings.upsert({
    where:  { key },
    update: { value, label },
    create: { key, value, label },
  })
  revalidatePath('/admin/pengaturan')
  revalidatePath('/')
}