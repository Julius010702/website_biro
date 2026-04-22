'use client'
// components/admin/GambarUpload.tsx
//
// FIX: Hidden input sekarang pakai `value={gambarUrl}` (controlled) bukan
// `defaultValue` + ref mutation. Ini memastikan nilai selalu terbaca dengan
// benar oleh Next.js Server Action saat form di-submit, bahkan di dalam
// form dengan action server.

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, ImageIcon, CheckCircle2 } from 'lucide-react'

interface GambarUploadProps {
  name: string
  defaultValue?: string
}

export default function GambarUpload({ name, defaultValue = '' }: GambarUploadProps) {
  // `gambarUrl` adalah satu-satunya sumber kebenaran — ini yang dikirim ke server
  const [gambarUrl, setGambarUrl] = useState<string>(defaultValue)
  const [preview,   setPreview]   = useState<string>(defaultValue)
  const [status,    setStatus]    = useState<'idle' | 'uploading' | 'done' | 'error'>(
    defaultValue ? 'done' : 'idle'
  )
  const [errorMsg,   setErrorMsg]  = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setStatus('error')
      setErrorMsg('Format tidak didukung. Gunakan JPG, PNG, atau WebP.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setStatus('error')
      setErrorMsg('Ukuran file melebihi 2MB.')
      return
    }

    // Preview lokal langsung
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setStatus('uploading')
    setErrorMsg('')
    // Kosongkan URL sementara upload berlangsung
    setGambarUrl('')

    try {
      const fd = new FormData()
      fd.append('file', file)

      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Upload gagal')
      }

      // ✅ Set state — hidden input otomatis terupdate karena value={gambarUrl}
      setGambarUrl(data.url)
      setPreview(data.url)
      setStatus('done')
      URL.revokeObjectURL(objectUrl)
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan saat upload.')
      setPreview(defaultValue)
      // Kembalikan ke gambar sebelumnya jika ada
      setGambarUrl(defaultValue)
      URL.revokeObjectURL(objectUrl)
    }
  }, [defaultValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setPreview('')
    setGambarUrl('')
    setStatus('idle')
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {/*
        ✅ KUNCI FIX: `value={gambarUrl}` (controlled) + onChange dummy.
        Ini memastikan nilai hidden input selalu sinkron dengan state React,
        sehingga Next.js Server Action selalu membaca URL yang benar.
        `readOnly` tidak dipakai karena akan suppress nilai saat serialisasi form.
      */}
      <input
        type="hidden"
        name={name}
        value={gambarUrl}
        onChange={() => {/* controlled, dikelola lewat setGambarUrl */}}
      />

      {/* Area upload / Preview */}
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
            cursor-pointer transition-all py-8 px-4 text-center select-none
            ${isDragging
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Klik untuk pilih gambar</p>
            <p className="text-xs text-gray-400 mt-0.5">atau seret dan lepas file di sini</p>
          </div>
          <p className="text-xs text-gray-400">JPG, PNG, WebP · Maks 2MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview gambar"
            className="w-full h-40 object-cover"
          />

          {/* Overlay loading */}
          {status === 'uploading' && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <span className="text-white text-sm font-medium">Mengupload...</span>
              <span className="text-white/70 text-xs">Tunggu selesai sebelum menyimpan</span>
            </div>
          )}

          {/* Badge sukses */}
          {status === 'done' && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow">
              <CheckCircle2 className="w-3 h-3" /> Berhasil diupload
            </div>
          )}

          {/* Tombol hapus */}
          {status !== 'uploading' && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors"
              title="Hapus gambar"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Tombol ganti */}
          {status !== 'uploading' && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <Upload className="w-3 h-3" /> Ganti
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" /> {errorMsg}
        </p>
      )}

      {/* URL tersimpan */}
      {status === 'done' && gambarUrl && (
        <p className="text-xs text-gray-400 truncate">✓ {gambarUrl}</p>
      )}
    </div>
  )
}