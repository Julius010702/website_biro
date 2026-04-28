'use server'
// app/actions/situs-terkait.ts
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

// ══════════════════════════════════════════════════════════════════════════════
// SITUS TERKAIT
// ══════════════════════════════════════════════════════════════════════════════

export async function upsertSitusTerkait(data: {
  id?:       string
  label:     string
  href:      string
  external?: boolean
  thumbnail?: string[]
  favicon?:  string
  deskripsi?: string
  urutan:    number
  aktif:     boolean
}) {
  await requireAdmin()
  const { id, ...rest } = data
  const payload = {
    label:     rest.label,
    href:      rest.href,
    external:  rest.external ?? true,
    thumbnail: rest.thumbnail ?? [],
    favicon:   rest.favicon ?? null,
    urutan:    rest.urutan,
    aktif:     rest.aktif,
  }
  if (id) {
    await prisma.situsTerkait.update({ where: { id }, data: payload })
  } else {
    await prisma.situsTerkait.create({ data: payload })
  }
  revalidatePath('/admin/situs-terkait')
  revalidatePath('/')
}

export async function deleteSitusTerkait(id: string) {
  await requireAdmin()
  await prisma.situsTerkait.delete({ where: { id } })
  revalidatePath('/admin/situs-terkait')
  revalidatePath('/')
}

export async function toggleAktifSitusTerkait(id: string, aktif: boolean) {
  await requireAdmin()
  await prisma.situsTerkait.update({ where: { id }, data: { aktif } })
  revalidatePath('/admin/situs-terkait')
  revalidatePath('/')
}

export async function updateUrutanSitusTerkait(items: { id: string; urutan: number }[]) {
  await requireAdmin()
  await Promise.all(
    items.map((item) =>
      prisma.situsTerkait.update({
        where: { id: item.id },
        data:  { urutan: item.urutan },
      })
    )
  )
  revalidatePath('/admin/situs-terkait')
  revalidatePath('/')
}