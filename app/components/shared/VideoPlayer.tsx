// components/shared/VideoPlayer.tsx
'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&\s]{11})/)
  return m?.[1] ?? null
}
function getYoutubeThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}
function getVimeoEmbed(url: string) {
  const id = url.match(/vimeo\.com\/(\d+)/)?.[1]
  return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null
}
function isYoutube(url: string) { return /youtube\.com|youtu\.be/.test(url) }
function isVimeo(url: string)   { return /vimeo\.com/.test(url) }

export default function VideoPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const ytId = isYoutube(url) ? getYoutubeId(url) : null

  if (isYoutube(url) && ytId) {
    const thumb = getYoutubeThumbnail(ytId)
    const embedSrc = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`
    return (
      <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', background: '#000', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
        {!playing ? (
          <div
            onClick={() => setPlaying(true)}
            style={{ position: 'absolute', inset: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt="thumbnail" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.30)' }} />
            <div style={{
              position: 'relative', zIndex: 2, width: 68, height: 48, borderRadius: 12,
              background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 24px rgba(255,0,0,0.50)',
            }}>
              <Play size={22} fill="white" color="white" style={{ marginLeft: 4 }} />
            </div>
          </div>
        ) : (
          <iframe
            src={embedSrc}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    )
  }

  if (isVimeo(url)) {
    const embedSrc = getVimeoEmbed(url)
    if (!embedSrc) return null
    return (
      <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', background: '#000' }}>
        <iframe
          src={embedSrc}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }

  // File video langsung (mp4, webm, dst)
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
      <video
        controls
        style={{ width: '100%', display: 'block', maxHeight: 400 }}
        src={url}
      />
    </div>
  )
}