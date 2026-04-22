// src/components/SitusTerkaitCard.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { type SitusTerkaitItem } from '@/lib/navigation'

// ─── Helper ───────────────────────────────────────────────────────────────────
function toSlides(thumbnail: SitusTerkaitItem['thumbnail']): string[] {
  if (!thumbnail) return []
  return Array.isArray(thumbnail) ? thumbnail : [thumbnail]
}

// ─── Slide interval (ms) ─────────────────────────────────────────────────────
const SLIDE_INTERVAL = 3000

// ─── Component ────────────────────────────────────────────────────────────────
export function SitusTerkaitCard({ item }: { item: SitusTerkaitItem }) {
  const slides = toSlides(item.thumbnail)
  const hasSlides = slides.length > 0
  const isMulti = slides.length > 1

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-advance when multiple slides and not paused
  useEffect(() => {
    if (!isMulti || paused) return
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, SLIDE_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isMulti, paused, slides.length])

  const goTo = (idx: number) => {
    setActive(idx)
    // Reset timer after manual nav
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, SLIDE_INTERVAL)
  }

  const cardInner = (
    <div
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Thumbnail area ── */}
      {hasSlides ? (
        <div className="relative aspect-video w-full overflow-hidden bg-black/30">
          {slides.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`${item.label} screenshot ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className={`object-cover transition-opacity duration-700 ${
                idx === active ? 'opacity-100' : 'opacity-0'
              }`}
              priority={idx === 0}
            />
          ))}

          {/* Dot indicators – only when multi */}
          {isMulti && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    goTo(idx)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === active
                      ? 'w-4 bg-white'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Progress bar – only when multi and not paused */}
          {isMulti && !paused && (
            <div
              key={`${active}-progress`}
              className="absolute bottom-0 left-0 h-0.5 bg-white/60"
              style={{
                animation: `slideProgress ${SLIDE_INTERVAL}ms linear forwards`,
              }}
            />
          )}
        </div>
      ) : (
        /* Fallback placeholder when no thumbnail */
        <div className="flex aspect-video w-full items-center justify-center bg-white/5">
          <span className="text-3xl font-bold text-white/20">
            {item.label.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      {/* ── Label row ── */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <span className="text-sm font-medium text-white/90 group-hover:text-white">
          {item.label}
        </span>
        <ExternalLink
          size={13}
          className="shrink-0 text-white/40 transition-colors group-hover:text-white/70"
        />
      </div>
    </div>
  )

  return (
    <Link
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-xl"
    >
      {cardInner}
    </Link>
  )
}

// ─── Grid wrapper (drop-in for footer section) ────────────────────────────────
export function SitusTerkaitGrid({ items }: { items: SitusTerkaitItem[] }) {
  return (
    <>
      {/* keyframe for progress bar */}
      <style>{`
        @keyframes slideProgress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <SitusTerkaitCard key={item.href} item={item} />
        ))}
      </div>
    </>
  )
}