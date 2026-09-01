'use client'
import { useState } from 'react'
import { Share2, Link2, Check, MessageCircle, Mail } from 'lucide-react'

export default function ShareButton({ title, url, slug }: { title: string; url: string; slug?: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== 'undefined' ? window.location.href : url

  function trackShare() {
    if (!slug) return
    fetch(`/api/berita/${slug}/share`, { method: 'POST' }).catch(() => {})
  }

  function copyLink() {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    trackShare()
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShareClick() {
    trackShare()
    setOpen(false)
  }

  const shareLinks = [
    {
      label: 'Facebook',
      color: '#1877F2',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'Twitter/X',
      color: '#000000',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
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
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
      url: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: 'Instagram',
      color: '#E1306C',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.0148.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
      url: `https://www.instagram.com/`,
    },
    {
      label: 'TikTok',
      color: '#000000',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.340 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>,
      url: `https://www.tiktok.com/`,
    },
    {
      label: 'LinkedIn',
      color: '#0A66C2',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'Email',
      color: '#EA4335',
      icon: <Mail className="w-4 h-4" />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(title + '\n\n' + fullUrl)}`,
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
          <div className="absolute right-0 bottom-12 z-50 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'white', border: '1px solid #DBEAFE', minWidth: 190 }}>
            <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}>
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#94A3B8' }}>Bagikan ke</p>
            </div>
            <div className="flex flex-col max-h-72 overflow-y-auto">
              {shareLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  style={{ textDecoration: 'none' }}
                  onClick={handleShareClick}>
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
