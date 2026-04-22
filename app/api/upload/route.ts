// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file     = formData.get('file')   as File   | null
    const folder   = (formData.get('folder') as string | null) ?? 'galeri'

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.' }, { status: 400 })
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file melebihi 2MB.' }, { status: 400 })
    }

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext       = file.name.split('.').pop()
    const fileName  = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Gunakan folder dari parameter — whitelist agar tidak bisa path traversal
    const safeFolder = ['berita', 'galeri', 'thumbnail'].includes(folder) ? folder : 'galeri'
    const uploadDir  = path.join(process.cwd(), 'public', 'uploads', safeFolder)

    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, fileName), buffer)

    return NextResponse.json({ url: `/uploads/${safeFolder}/${fileName}` })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Gagal mengupload file.' }, { status: 500 })
  }
}