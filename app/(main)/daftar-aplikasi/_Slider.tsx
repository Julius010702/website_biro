'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import NextImage from 'next/image'
import { ChevronLeft, ChevronRight, Monitor, ExternalLink } from 'lucide-react'

type Aplikasi = {
  id: string
  nama: string
  deskripsi: string | null
  href: string
  kategori: string | null
  logo: string | null
}

const VISIBLE = 4
const CARD_W = 240
const GAP = 20

export default function DaftarAplikasiSlider({ list }: { list: Aplikasi[] }) {
  const [idx, setIdx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragDelta, setDragDelta] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const maxIdx = Math.max(0, list.length - VISIBLE)

  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIdx(i => Math.min(maxIdx, i + 1)), [maxIdx])

  // Auto slide
  useEffect(() => {
    if (list.length <= VISIBLE) return
    autoRef.current = setInterval(() => {
      setIdx(i => i >= maxIdx ? 0 : i + 1)
    }, 3500)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [list.length, maxIdx])

  function resetAuto() {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setIdx(i => i >= maxIdx ? 0 : i + 1)
    }, 3500)
  }

  // Drag/swipe
  function onMouseDown(e: React.MouseEvent) {
    setIsDragging(true)
    setStartX(e.clientX)
    setDragDelta(0)
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging) return
    setDragDelta(e.clientX - startX)
  }
  function onMouseUp() {
    if (!isDragging) return
    setIsDragging(false)
    if (dragDelta < -60) { next(); resetAuto() }
    else if (dragDelta > 60) { prev(); resetAuto() }
    setDragDelta(0)
  }
  function onTouchStart(e: React.TouchEvent) {
    setStartX(e.touches[0].clientX)
    setDragDelta(0)
  }
  function onTouchMove(e: React.TouchEvent) {
    setDragDelta(e.touches[0].clientX - startX)
  }
  function onTouchEnd() {
    if (dragDelta < -60) { next(); resetAuto() }
    else if (dragDelta > 60) { prev(); resetAuto() }
    setDragDelta(0)
  }

  if (list.length === 0) {
    return (
      <div className="text-center py-20">
        <Monitor className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E1' }} />
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Belum ada aplikasi tersedia.</p>
      </div>
    )
  }

  const offset = -(idx * (CARD_W + GAP)) + (isDragging ? dragDelta : 0)

  return (
    <div className="pb-16">
      {/* Slider container */}
      <div className="relative max-w-5xl mx-auto px-14">

        {/* Prev button */}
        <button
          onClick={() => { prev(); resetAuto() }}
          disabled={idx === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'white',
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Track window */}
        <div className="overflow-hidden rounded-2xl py-4">
          <div
            ref={trackRef}
            className="flex select-none"
            style={{
              gap: GAP,
              transform: `translateX(${offset}px)`,
              transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {list.map((app) => (
              <a
                key={app.id}
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                className="group flex flex-col items-center rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  minWidth: CARD_W,
                  width: CARD_W,
                  background: 'white',
                  border: '1px solid #E2EAF6',
                  boxShadow: '0 2px 12px rgba(13,71,161,0.06)',
                  textDecoration: 'none',
                  padding: '28px 20px 20px',
                }}
              >
                {/* Logo */}
                <div
                  className="flex items-center justify-center mb-4 rounded-xl overflow-hidden"
                  style={{
                    width: 160,
                    height: 80,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {app.logo ? (
                    <NextImage
                      src={app.logo}
                      alt={app.nama}
                      width={140}
                      height={70}
                      className="object-contain"
                      draggable={false}
                    />
                  ) : (
                    <Monitor className="w-10 h-10" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  )}
                </div>

                {/* Info */}
                <div className="w-full text-center">
                  <p className="text-sm font-black mb-0.5 leading-tight" style={{ color: 'white', fontFamily: 'var(--font-heading)' }}>
                    {app.nama}
                  </p>
                  {app.kategori && (
                    <p className="text-[10px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {app.kategori}
                    </p>
                  )}
                  {app.deskripsi && (
                    <p className="text-[11px] leading-relaxed mb-3 line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {app.deskripsi}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div
                  className="flex items-center gap-1.5 text-xs font-bold mt-auto pt-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0"
                  style={{ color: '#F5A623' }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Aplikasi
                </div>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(90deg, #F5A623, #F59E0B)' }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={() => { next(); resetAuto() }}
          disabled={idx >= maxIdx}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'white',
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      {list.length > VISIBLE && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIdx + 1 }).map((_item, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); resetAuto() }}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                background: i === idx ? '#F5A623' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {list.length} aplikasi tersedia
      </p>
    </div>
  )
}
