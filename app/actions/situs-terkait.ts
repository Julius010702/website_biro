// actions/admin/situs-terkait.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type SitusTerkaitPayload = {
  id?:       string
  label:     string
  href:      string
  external:  boolean
  thumbnail: string[]   // array URL
  favicon?:  string
  aktif:     boolean
  urutan:    number
}

// ── Upsert (create or update) ─────────────────────────────────────────────────
export async function upsertSitusTerkait(payload: SitusTerkaitPayload) {
  const data = {
    label:     payload.label.trim(),
    href:      payload.href.trim(),
    external:  payload.external,
    thumbnail: payload.thumbnail.filter(Boolean),
    favicon:   payload.favicon?.trim() || null,
    aktif:     payload.aktif,
    urutan:    payload.urutan,
  }

  if (payload.id) {
    await prisma.situsTerkait.update({ where: { id: payload.id }, data })
  } else {
    await prisma.situsTerkait.create({ data })
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function deleteSitusTerkait(id: string) {
  await prisma.situsTerkait.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin')
}

// ── Toggle aktif ──────────────────────────────────────────────────────────────
export async function toggleAktifSitusTerkait(id: string, aktif: boolean) {
  await prisma.situsTerkait.update({ where: { id }, data: { aktif } })
  revalidatePath('/')
  revalidatePath('/admin')
}

// ── Update urutan (drag-and-drop order) ───────────────────────────────────────
export async function updateUrutanSitusTerkait(items: { id: string; urutan: number }[]) {
  await Promise.all(
    items.map(({ id, urutan }) =>
      prisma.situsTerkait.update({ where: { id }, data: { urutan } })
    )
  )
  revalidatePath('/')
  revalidatePath('/admin')
}