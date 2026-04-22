'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type Props = {
  images: string[]
  alt: string
  accent: string
  initials: string
  label: string
}

export default function SitusThumbnailSlide({
  images,
  alt,
  accent,
  initials,
  label,
}: Props) {
  const [current, setCurrent] = useState(0)
  const validImages = images.filter(Boolean)

  useEffect(() => {
    if (validImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % validImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [validImages.length])

  if (validImages.length === 0) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: `${accent}14` }}
      >
        <span className="text-xl font-black" style={{ color: accent }}>
          {initials}
        </span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {validImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            className="object-cover object-top"
            sizes="160px"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div
        className="absolute inset-x-0 bottom-0 h-10 z-10"
        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
      />

      {/* Label */}
      <span
        className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-bold tracking-widest uppercase z-20"
        style={{ color: 'rgba(255,255,255,0.9)' }}
      >
        {label}
      </span>

      {/* Dot indicator */}
      {validImages.length > 1 && (
        <div className="absolute top-1.5 right-1.5 flex gap-0.5 z-20">
          {validImages.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '12px' : '4px',
                height: '4px',
                background: i === current ? accent : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}