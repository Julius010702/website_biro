// components/shared/BeritaImage.tsx
// Komponen terpusat untuk menangani gambar berita.
// Gambar lokal (/uploads/...) menggunakan `unoptimized` agar tidak error di Next.js.
// Gambar external (http/https) tetap dioptimasi normal.

import Image from 'next/image'

interface BeritaImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
}

function isLocalPath(url: string): boolean {
  // Lokal: dimulai dengan / tapi bukan //
  return url.startsWith('/') && !url.startsWith('//')
}

export default function BeritaImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  className,
}: BeritaImageProps) {
  const unoptimized = isLocalPath(src)

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        unoptimized={unoptimized}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 400}
      height={height ?? 300}
      sizes={sizes}
      priority={priority}
      className={className}
      unoptimized={unoptimized}
    />
  )
}

// Placeholder saat tidak ada gambar
export function GambarPlaceholder({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const fontSize = size === 'lg' ? 'text-6xl' : size === 'md' ? 'text-4xl' : 'text-2xl'
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${fontSize}`}
      style={{
        background: 'linear-gradient(135deg, var(--color-ntt-red-800), var(--color-ntt-dark))',
      }}
    >
      🦅
    </div>
  )
}