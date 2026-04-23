// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.' },
        { status: 400 }
      )
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file melebihi 4MB.' }, { status: 400 })
    }

    const response = await utapi.uploadFiles(file)

    if (response.error) {
      console.error('UploadThing error:', response.error)
      return NextResponse.json({ error: 'Gagal mengupload file.' }, { status: 500 })
    }

    return NextResponse.json({ url: response.data.ufsUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Gagal mengupload file.' }, { status: 500 })
  }
}