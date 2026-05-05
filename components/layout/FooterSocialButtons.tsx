'use client'
import { useState } from 'react'
import Link from 'next/link'

type SosmedItem = { platform: string; url: string; aktif: boolean }

function getHoverBg(platform: string): string {
  const p = platform.toLowerCase()
  if (p === 'instagram') return 'rgba(225,48,108,0.9)'
  if (p === 'youtube') return 'rgba(255,0,0,0.9)'
  if (p === 'facebook') return 'rgba(24,119,242,0.9)'
  if (p === 'twitter' || p === 'x') return 'rgba(29,161,242,0.9)'
  if (p === 'tiktok') return 'rgba(0,0,0,0.85)'
  return 'rgba(99,102,241,0.9)'
}

function PlatformSVG({ platform }: { platform: string }) {
  const p = platform.toLowerCase()
  if (p === 'instagram') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
  if (p === 'youtube') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
  if (p === 'facebook') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

function SocialButton({ platform, url }: { platform: string; url: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={platform}
      onMouseEnter={function() { setHovered(true) }}
      onMouseLeave={function() { setHovered(false) }}
      style={{
        width: '36px', height: '36px', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? getHoverBg(platform) : 'rgba(255,255,255,0.08)',
        border: '1px solid ' + (hovered ? 'transparent' : 'rgba(255,255,255,0.12)'),
        color: 'rgba(255,255,255,0.9)',
        transition: 'all 0.2s ease',
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        flexShrink: 0,
      }}>
      <PlatformSVG platform={platform} />
    </Link>
  )
}

export default function FooterSocialButtons({ sosmedList }: { sosmedList: SosmedItem[] }) {
  if (sosmedList.length === 0) return null
  return (
    <div className="flex gap-2.5 flex-wrap">
      {sosmedList.map(function(s) {
        return <SocialButton key={s.platform + s.url} platform={s.platform} url={s.url} />
      })}
    </div>
  )
}
