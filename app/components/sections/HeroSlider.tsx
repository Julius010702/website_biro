'use client'
// components/sections/HeroSlider.tsx

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Shield, Building2, MapPin, FileText,
  ChevronLeft, ChevronRight, Play, Pause,
} from 'lucide-react'

type StatItem = { id: string; nilai: string; label: string; ikon: string }
interface HeroSliderProps { stats: StatItem[]; tagline: string }

const slides = [
  {
    id: 1, gambar: '/images/hero/gedung-pemprov.jpeg',
    badge: 'Pemerintah Provinsi NTT', judul: 'Biro Organisasi',
    subjudul: 'Setda Provinsi Nusa Tenggara Timur',
    deskripsi: 'Mendukung tata kelola pemerintahan yang efektif, efisien, dan akuntabel demi pelayanan publik terbaik bagi seluruh masyarakat NTT.',
    href: '/profil/sekapur-sirih', cta: 'Profil Kami', accent: '#F5A623',
  },
  {
    id: 2, gambar: '/images/hero/wae-rebo.jpeg',
    badge: 'Budaya & Warisan Leluhur', judul: 'Kampung Adat',
    subjudul: 'Wae Rebo — Manggarai',
    deskripsi: 'Kekayaan budaya NTT menjadi inspirasi tata kelola yang berakar pada kearifan lokal. Pemerintah berkomitmen menjaga warisan untuk generasi mendatang.',
    href: '/berita', cta: 'Lihat Berita', accent: '#34D399',
  },
  {
    id: 3, gambar: '/images/hero/sumba-tarung.jpeg',
    badge: 'Kampung Adat Sumba', judul: 'Kampung Tarung',
    subjudul: 'Sumba Barat — NTT',
    deskripsi: 'Kampung tradisional Sumba adalah warisan budaya yang terus dijaga. Biro Organisasi berperan dalam pelestarian kearifan lokal Nusa Tenggara Timur.',
    href: '/berita', cta: 'Eksplorasi', accent: '#FBBF24',
  },
  {
    id: 4, gambar: '/images/hero/komodo-padar.jpeg',
    badge: 'Wisata Bahari', judul: 'Pesona Komodo',
    subjudul: 'Pulau Padar — Labuan Bajo',
    deskripsi: 'Keindahan bahari NTT diakui dunia. Pemerintah Provinsi terus mendorong pengembangan pariwisata berkelanjutan di Nusa Tenggara Timur.',
    href: '/berita', cta: 'Wisata NTT', accent: '#38BDF8',
  },
  {
    id: 5, gambar: '/images/hero/geowisata-timor.jpeg',
    badge: 'Geowisata NTT', judul: 'Keajaiban Bumi',
    subjudul: 'Formasi Batuan Timor',
    deskripsi: 'Formasi batuan unik yang menjadi daya tarik geowisata NTT. Keberagaman alam menjadi aset penting pembangunan daerah yang berkelanjutan.',
    href: '/berita', cta: 'Lebih Lanjut', accent: '#FB923C',
  },
  {
    id: 6, gambar: '/images/hero/panorama-laut.jpeg',
    badge: 'Reformasi Birokrasi', judul: 'Menuju NTT Maju',
    subjudul: 'BerAKHLAK — Fondasi ASN NTT',
    deskripsi: 'Berorientasi Pelayanan · Akuntabel · Kompeten · Harmonis · Loyal · Adaptif · Kolaboratif. Nilai yang menjadi fondasi setiap ASN Provinsi NTT.',
    href: '/profil/bagian/reformasi-birokrasi-akuntabilitas', cta: 'Reformasi Birokrasi', accent: '#C084FC',
  },
]

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />,
  MapPin:    <MapPin    className="w-4 h-4 sm:w-5 sm:h-5" />,
  FileText:  <FileText  className="w-4 h-4 sm:w-5 sm:h-5" />,
  Shield:    <Shield    className="w-4 h-4 sm:w-5 sm:h-5" />,
}

export default function HeroSlider({ stats, tagline }: HeroSliderProps) {
  const [current, setCurrent]   = useState(0)
  const [animKey, setAnimKey]   = useState(0)
  const [paused, setPaused]     = useState(false)
  const [progress, setProgress] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const DURATION    = 6500

  const goTo = useCallback((idx: number) => {
    setCurrent(idx); setAnimKey((k) => k + 1); setProgress(0)
  }, [])

  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo])
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  const startTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setProgress(0)
    intervalRef.current = setInterval(() => {
      setCurrent((c) => { const n = (c + 1) % slides.length; setAnimKey((k) => k + 1); setProgress(0); return n })
    }, DURATION)
    const tick = 50
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (tick / DURATION) * 100, 100))
    }, tick)
  }, [])

  const stopTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  useEffect(() => { if (!paused) startTimers(); else stopTimers(); return stopTimers }, [paused, startTimers, stopTimers])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!paused) startTimers() }, [current])

  const slide = slides[current]

  return (
    <section className="hero-section">
      {/* ── Slides ── */}
      <div className="hero-inner">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <div className="absolute inset-0" style={{
              transform: i === current ? 'scale(1)' : 'scale(1.06)',
              transition: 'transform 8s ease',
            }}>
              <Image
                src={s.gambar} alt={s.judul} fill priority={i === 0}
                sizes="100vw" className="object-cover"
              />
            </div>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(135deg, rgba(10,35,66,0.92) 0%, rgba(13,71,161,0.68) 50%, rgba(0,0,0,0.30) 100%)',
            }} />
          </div>
        ))}

        {/* Diagonal texture */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2, opacity: 0.04 }}>
          <defs>
            <pattern id="hero-lines" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <line x1="0" y1="60" x2="60" y2="0" stroke={slide.accent} strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-lines)" />
        </svg>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 pointer-events-none" style={{
          width: '400px', height: '400px', borderRadius: '50%',
          background: `radial-gradient(circle, ${slide.accent}18 0%, transparent 65%)`,
          transform: 'translate(30%, -30%)',
          transition: 'background 0.8s ease', zIndex: 2,
        }} />

        {/* Vertical dot nav — desktop only */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3" style={{ zIndex: 10 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: '4px', height: i === current ? '32px' : '16px',
                backgroundColor: i === current ? slide.accent : 'rgba(255,255,255,0.28)',
                border: 'none', padding: 0,
              }} />
          ))}
        </div>

        {/* ── Main content ── */}
        <div
          className="relative w-full h-full flex items-center hero-content"
          style={{ zIndex: 5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">

              {/* LEFT — text */}
              <div key={animKey} style={{ animation: 'heroFadeUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards' }}>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 sm:mb-5"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: `1px solid ${slide.accent}55`,
                    backdropFilter: 'blur(8px)',
                  }}>
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: slide.accent }} />
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-white">
                    {slide.badge}
                  </span>
                </div>

                {/* Heading */}
                <h1
                  className="font-bold text-white leading-tight mb-3"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
                >
                  {slide.judul}
                  <span
                    className="block font-semibold mt-1"
                    style={{
                      color: slide.accent,
                      fontSize: 'clamp(0.95rem, 2.5vw, 1.75rem)',
                      transition: 'color 0.6s ease',
                    }}
                  >
                    {slide.subjudul}
                  </span>
                </h1>

                {/* Divider */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-0.5 rounded-full w-12" style={{ backgroundColor: slide.accent }} />
                  <div className="h-0.5 rounded-full w-4" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
                </div>

                {/* Tagline */}
                <p className="text-sm sm:text-base font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {tagline}
                </p>

                {/* Description — hidden on xs */}
                <p className="hidden sm:block text-sm leading-relaxed mb-6 max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {slide.deskripsi}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-2.5 mb-6 sm:mb-8">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: slide.accent, color: '#0A2342',
                      boxShadow: `0 4px 20px ${slide.accent}45`,
                      transition: 'background 0.4s ease, transform 0.15s ease',
                    }}
                  >
                    {slide.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/berita"
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'rgba(255,255,255,0.1)', color: '#fff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    Berita Terkini
                  </Link>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button onClick={prev} aria-label="Slide sebelumnya"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff' }}>
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button onClick={next} aria-label="Slide berikutnya"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ backgroundColor: slide.accent, color: '#0A2342', border: 'none' }}>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Dot indicators */}
                  <div className="flex items-center gap-1.5 ml-1">
                    {slides.map((_, i) => (
                      <button key={i} onClick={() => goTo(i)} aria-label={`Ke slide ${i + 1}`}
                        className="rounded-full transition-all duration-300 cursor-pointer"
                        style={{
                          width: i === current ? '18px' : '6px', height: '6px',
                          backgroundColor: i === current ? slide.accent : 'rgba(255,255,255,0.3)',
                          border: 'none', padding: 0,
                        }} />
                    ))}
                  </div>

                  <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Putar' : 'Jeda'}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                    {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  </button>

                  <span className="ml-auto text-[11px] font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* RIGHT — Logo + Stats (desktop only) */}
              <div className="hidden lg:flex flex-col items-center gap-8">
                {/* Emblem */}
                <div className="relative" style={{
                  width: '180px', height: '180px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  border: `2px solid ${slide.accent}35`,
                  boxShadow: `0 0 80px ${slide.accent}18, 0 20px 60px rgba(0,0,0,0.3)`,
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 0.8s ease, box-shadow 0.8s ease',
                }}>
                  <Image
                    src="/images/logo-prov-ntt.png" alt="Logo Provinsi NTT"
                    fill sizes="180px" className="object-contain p-5" priority
                  />
                  <div className="absolute -inset-3 rounded-full" style={{
                    border: `1px dashed ${slide.accent}28`,
                    animation: 'spinSlow 30s linear infinite',
                  }} />
                </div>

                {/* Stats grid desktop */}
                {stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    {stats.slice(0, 4).map((s) => (
                      <div key={s.id}
                        className="rounded-2xl p-4 text-center transition-transform hover:scale-105"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          backdropFilter: 'blur(8px)',
                        }}>
                        <div className="flex justify-center mb-1.5" style={{ color: slide.accent }}>
                          {iconMap[s.ikon] ?? <Shield className="w-5 h-5" />}
                        </div>
                        <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                          {s.nilai}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats mobile — 2x2 grid, lebih aman dari 4-col */}
              {stats.length > 0 && (
                <div className="lg:hidden grid grid-cols-2 gap-2 w-full">
                  {stats.slice(0, 4).map((s) => (
                    <div key={s.id}
                      className="rounded-xl p-3 flex items-center gap-2.5"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(8px)',
                      }}>
                      <div className="shrink-0" style={{ color: slide.accent }}>
                        {iconMap[s.ikon] ?? <Shield className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                          {s.nilai}
                        </div>
                        <div className="text-[10px] mt-0.5 leading-tight truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          {s.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.08)', zIndex: 10 }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          backgroundColor: slide.accent,
          borderRadius: '0 2px 2px 0',
          transition: 'background-color 0.6s ease',
        }} />
      </div>

      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          min-height: 100svh;
        }
        .hero-inner {
          position: relative;
          flex: 1;
          min-height: 100svh;
          width: 100%;
        }
        .hero-content {
          padding-top: 5rem;
          padding-bottom: 4rem;
          min-height: 100svh;
        }
        @media (max-width: 639px) {
          .hero-section { min-height: calc(100svh - 4rem); }
          .hero-inner   { min-height: calc(100svh - 4rem); }
          .hero-content {
            padding-top: 3.5rem;
            padding-bottom: 5rem;
            min-height: calc(100svh - 4rem);
          }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
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