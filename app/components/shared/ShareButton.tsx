// app/components/shared/ShareButton.tsx
'use client'
import { useState } from 'react'
import { Share2, Facebook, Twitter, Link2, Check, MessageCircle } from 'lucide-react'

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
      icon: <Facebook className="w-4 h-4" />,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'Twitter/X',
      icon: <Twitter className="w-4 h-4" />,
      color: '#000000',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4" />,
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + fullUrl)}`,
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