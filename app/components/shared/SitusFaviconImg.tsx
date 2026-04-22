'use client'

import { useState } from 'react'

type Props = {
  src: string
  alt: string
  accent: string
  initials: string
}

export default function SitusFaviconImg({ src, alt, accent, initials }: Props) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <span className="text-xl font-black" style={{ color: accent }}>
        {initials}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-10 h-10 object-contain"
      onError={() => setError(true)}
    />
  )
}