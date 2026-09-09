'use client'
// app/components/common/ZoomableImage.tsx
import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ZoomableImageProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  width?: number
  height?: number
}

export default function ZoomableImage({ src, alt, className, sizes, width = 800, height = 800 }: ZoomableImageProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-zoom-in appearance-none bg-transparent border-0 p-0"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          sizes={sizes}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  )
}
