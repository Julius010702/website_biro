'use client'
// components/sections/HeroSlider.tsx
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Shield, Building2, MapPin, FileText,
  ChevronLeft, ChevronRight, Play, Pause,
} from 'lucide-react'

type SlideItem = { id: string; judul: string; deskripsi: string | null; gambar: string; urutan: number; aktif: boolean }
type StatItem  = { id: string; nilai: string; label: string; ikon: string | null }
interface HeroSliderProps { slides: SlideItem[]; stats: StatItem[]; tagline: string }

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-4 h-4" />,
  MapPin:    <MapPin    className="w-4 h-4" />,
  FileText:  <FileText  className="w-4 h-4" />,
  Shield:    <Shield    className="w-4 h-4" />,
}

const ACCENTS  = ['#F5A623', '#34D399', '#FBBF24', '#38BDF8', '#FB923C', '#C084FC']
const DURATION = 6500

export default function HeroSlider({ slides, stats, tagline }: HeroSliderProps) {
  const [current, setCurrent]   = useState(0)
  const [animKey, setAnimKey]   = useState(0)
  const [paused,  setPaused]    = useState(false)
  const [progress,setProgress]  = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((idx: number) => { setCurrent(idx); setAnimKey((k) => k + 1); setProgress(0) }, [])
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length])
  const next = useCallback(() => goTo((current + 1) % slides.length),                 [current, goTo, slides.length])

  const startTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setProgress(0)
    intervalRef.current = setInterval(() => {
      setCurrent((c) => { const n = (c + 1) % slides.length; setAnimKey((k) => k + 1); setProgress(0); return n })
    }, DURATION)
    const tick = 50
    progressRef.current = setInterval(() => setProgress((p) => Math.min(p + (tick / DURATION) * 100, 100)), tick)
  }, [slides.length])

  const stopTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  useEffect(() => { if (!paused) startTimers(); else stopTimers(); return stopTimers }, [paused, startTimers, stopTimers])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!paused) startTimers() }, [current])

  if (!slides.length) return null

  const slide  = slides[current]
  const accent = ACCENTS[current % ACCENTS.length]

  return (
    <section className="hero-root">

      {/* Slide backgrounds */}
      {slides.map((s, i) => (
        <div key={s.id} className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}>
          <Image src={s.gambar} alt={s.judul} fill priority={i === 0} sizes="100vw"
            className="object-cover"
            style={{ transform: i === current ? 'scale(1.04)' : 'scale(1)', transition: 'transform 8s ease', filter: 'brightness(0.92)' }} />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(105deg, rgba(6,22,54,0.82) 0%, rgba(10,35,80,0.55) 45%, rgba(0,0,0,0.08) 100%)',
        zIndex: 1,
      }} />

      {/* Dot texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2, opacity: 0.025 }}>
        <defs><pattern id="hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="white" />
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Accent glow */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{
        width: '520px', height: '520px',
        background: `radial-gradient(circle at 70% 30%, ${accent}14 0%, transparent 60%)`,
        transition: 'background 0.8s ease', zIndex: 2,
      }} />

      {/* Vertical dot nav */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2.5" style={{ zIndex: 20 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
            style={{ width: '3px', height: i === current ? '28px' : '12px', borderRadius: '2px',
              backgroundColor: i === current ? accent : 'rgba(255,255,255,0.25)',
              border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>

      {/* Main content — max-w-screen-2xl untuk layar besar */}
      <div className="relative w-full h-full hero-content-wrap" style={{ zIndex: 5 }}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center h-full">

            {/* LEFT TEXT */}
            <div className="lg:col-span-3" key={animKey} style={{ animation: 'heroFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards' }}>

              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5"
                style={{ background: 'transparent', border: `1px solid ${accent}60` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
                  Biro Organisasi · Setda NTT
                </span>
              </div>

              <h1 className="font-bold text-white leading-[1.1] mb-3"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)',
                  textShadow: '0 2px 24px rgba(0,0,0,0.35)', letterSpacing: '-0.01em' }}>
                {slide.judul}
              </h1>

              {slide.deskripsi && (
                <p className="font-semibold mb-4 leading-snug"
                  style={{ color: accent, fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
                    transition: 'color 0.6s ease', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {slide.deskripsi}
                </p>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div className="h-0.5 rounded-full w-10" style={{ backgroundColor: accent, transition: 'background-color 0.6s' }} />
                <div className="h-px rounded-full w-5 bg-white/20" />
              </div>

              <p className="text-sm sm:text-[15px] mb-7 leading-relaxed max-w-lg"
                style={{ color: 'rgba(255,255,255,0.80)', fontFamily: 'var(--font-sans)' }}>
                {tagline}
              </p>

              <div className="flex flex-wrap gap-3 mb-7">
                <Link href="/profil/sekapur-sirih"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: accent, color: '#061636', boxShadow: `0 4px 20px ${accent}40`, transition: 'background-color 0.5s, box-shadow 0.5s, transform 0.15s' }}>
                  Profil Kami <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/berita"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1px solid rgba(255,255,255,0.22)' }}>
                  Berita Terkini
                </Link>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2.5">
                <button onClick={prev} aria-label="Sebelumnya"
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer' }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} aria-label="Berikutnya"
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: accent, color: '#061636', border: 'none', cursor: 'pointer', transition: 'background-color 0.5s' }}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                      style={{ width: i === current ? '20px' : '6px', height: '6px', borderRadius: '3px',
                        backgroundColor: i === current ? accent : 'rgba(255,255,255,0.28)',
                        border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease' }} />
                  ))}
                </div>
                <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Putar' : 'Jeda'}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.55)', cursor: 'pointer' }}>
                  {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                </button>
                <span className="ml-2 text-[11px] font-semibold tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* RIGHT PANEL - desktop only */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center gap-6">
              <div className="relative" style={{ width: '156px', height: '156px', borderRadius: '50%',
                background: 'transparent', border: `1.5px solid ${accent}50`,
                boxShadow: `0 0 60px ${accent}16, 0 16px 48px rgba(0,0,0,0.25)`,
                transition: 'border-color 0.8s, box-shadow 0.8s', flexShrink: 0 }}>
                <Image src="/images/logo-prov-ntt.png" alt="Logo NTT" fill sizes="156px" className="object-contain p-4" priority />
                <div className="absolute -inset-3 rounded-full" style={{ border: `1px dashed ${accent}30`, animation: 'spinSlow 25s linear infinite', transition: 'border-color 0.8s' }} />
              </div>
              {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 w-full">
                  {stats.slice(0, 4).map((s) => (
                    <div key={s.id} className="rounded-2xl p-4 text-center transition-transform duration-200 hover:scale-105"
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.20)' }}>
                      <div className="flex justify-center mb-2" style={{ color: accent, transition: 'color 0.6s' }}>
                        {iconMap[s.ikon ?? ''] ?? <Shield className="w-4 h-4" />}
                      </div>
                      <div className="text-xl font-black text-white mb-0.5"
                        style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
                        {s.nilai}
                      </div>
                      <div className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.48)' }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Stats mobile */}
      {stats.length > 0 && (
        <div className="lg:hidden relative w-full px-4 pb-6" style={{ zIndex: 5 }}>
          <div className="grid grid-cols-2 gap-2">
            {stats.slice(0, 4).map((s) => (
              <div key={s.id} className="rounded-xl p-3 flex items-center gap-2.5"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.20)' }}>
                <div className="shrink-0" style={{ color: accent }}>
                  {iconMap[s.ikon ?? ''] ?? <Shield className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black text-white leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                    {s.nilai}
                  </div>
                  <div className="text-[10px] mt-0.5 leading-tight truncate" style={{ color: 'rgba(255,255,255,0.48)' }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '2px', background: 'rgba(255,255,255,0.07)', zIndex: 20 }}>
        <div style={{ height: '100%', width: `${progress}%`, backgroundColor: accent,
          borderRadius: '0 2px 2px 0', transition: 'background-color 0.6s ease' }} />
      </div>

      <style>{`
        .hero-root {
          position: relative;
          width: 100%;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .hero-content-wrap {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
          padding-top: 4rem;
          padding-bottom: 3.5rem;
          min-height: 100svh;
        }
        @media (max-width: 639px) {
          .hero-root         { min-height: calc(100svh - 0px); }
          .hero-content-wrap { padding-top: 3rem; padding-bottom: 1rem; min-height: auto; }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}