'use client'
// components/shared/ShareButton.tsx
import { useState } from 'react'
import { Share2, Link2, Check } from 'lucide-react'

// ─── Inline SVG (Facebook & X not available in this lucide-react version) ─────
function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface ShareButtonProps {
  title: string
  url: string
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const fullUrl = typeof window !== 'undefined' ? window.location.origin + url : url

  async function copyLink() {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => { setCopied(false); setOpen(false) }, 2000)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'white',
          border: '1px solid #DBEAFE',
          color: '#1565C0',
          boxShadow: '0 2px 8px rgba(13,71,161,0.08)',
        }}
      >
        <Share2 className="w-3.5 h-3.5" /> Bagikan
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-2xl overflow-hidden min-w-44"
            style={{
              background: 'white',
              border: '1px solid #DBEAFE',
              boxShadow: '0 8px 30px rgba(13,71,161,0.15)',
            }}
          >
            <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #EFF6FF', background: '#F8FAFF' }}>
              <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#94A3B8' }}>
                Bagikan ke
              </p>
            </div>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-xs font-semibold transition-colors hover:bg-blue-50"
              style={{ color: '#1877F2', borderBottom: '1px solid #F0F4FF' }}
            >
              <IconFacebook /> Facebook
            </a>

            {/* Twitter/X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-xs font-semibold transition-colors hover:bg-slate-50"
              style={{ color: '#0F1419', borderBottom: '1px solid #F0F4FF' }}
            >
              <IconX /> Twitter / X
            </a>

            {/* Copy link */}
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold transition-colors hover:bg-green-50"
              style={{ color: copied ? '#16A34A' : '#374151' }}
            >
              {copied
                ? <><Check className="w-4 h-4" /> Tersalin!</>
                : <><Link2 className="w-4 h-4" /> Salin Tautan</>
              }
            </button>
          </div>
        </>
      )}
    </div>
  )
}