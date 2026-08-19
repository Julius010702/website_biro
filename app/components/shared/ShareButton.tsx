'use client'
import { useState } from 'react'
import { Share2, Link2, Check, MessageCircle } from 'lucide-react'

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== 'undefined' ? window.location.href : url

  function copyLink() {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      label: 'Facebook',
      color: '#1877F2',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'Twitter/X',
      color: '#000000',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'WhatsApp',
      color: '#25D366',
      icon: <MessageCircle className="w-4 h-4" />,
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + fullUrl)}`,
    },
    {
      label: 'Telegram',
      color: '#0088CC',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
        style={{ background: open ? '#EFF6FF' : 'white', color: open ? '#0D47A1' : '#64748B', border: '1px solid ' + (open ? '#DBEAFE' : '#E2E8F0') }}
      >
        <Share2 className="w-3.5 h-3.5" /> Bagikan
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-10 z-50 rounded-2xl overflow-hidden shadow-xl"
            style={{ background: 'white', border: '1px solid #DBEAFE', minWidth: 180 }}>
            <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}>
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#94A3B8' }}>Bagikan ke</p>
            </div>
            <div className="flex flex-col">
              {shareLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setOpen(false)}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
                    style={{ background: s.color }}>
                    {s.icon}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: '#374151' }}>{s.label}</span>
                </a>
              ))}
              <button onClick={copyLink}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors w-full text-left"
                style={{ borderTop: '1px solid #EEF3FC' }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: copied ? '#ECFDF5' : '#F1F5F9' }}>
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4 text-slate-500" />}
                </span>
                <span className="text-xs font-semibold" style={{ color: copied ? '#065F46' : '#374151' }}>
                  {copied ? 'Link disalin!' : 'Salin Link'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}