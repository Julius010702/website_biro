'use client'

import { useState } from 'react'

type Props = {
  src: string
  alt: string
  initials: string
  accent: string
}

export default function SitusLogo({ src, alt, initials, accent }: Props) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <span className="text-base font-black" style={{ color: accent }}>
        {initials}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="rounded-lg object-contain"
      onError={() => setError(true)}
    />
  )
}