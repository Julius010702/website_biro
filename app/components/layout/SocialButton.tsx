'use client'

// components/layout/SocialButton.tsx
import Link from 'next/link'
import { useState } from 'react'

type Props = {
  icon: React.ReactNode
  href: string
  label: string
  hoverBg: string
}

export default function SocialButton({ icon, href, label, hoverBg }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hovered ? hoverBg : 'rgba(255,255,255,0.08)',
        border: `1px solid ${hovered ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
        color: 'rgba(255,255,255,0.9)',
        transition: 'all 0.2s ease',
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        flexShrink: 0,
      }}
    >
      {icon}
    </Link>
  )
}