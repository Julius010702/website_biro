'use client'
// app/admin/login/page.tsx

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, LogIn, ShieldCheck, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        const res  = await fetch('/api/auth/login', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.message ?? 'Email atau kata sandi salah.'); return }
        router.push('/admin')
        router.refresh()
      } catch {
        setError('Terjadi kesalahan. Coba lagi beberapa saat.')
      }
    })
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(245,166,35,0.15), 0 0 0 1px rgba(245,166,35,0.20); }
          50%       { box-shadow: 0 0 60px rgba(245,166,35,0.35), 0 0 0 1px rgba(245,166,35,0.40); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .anim-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
        .anim-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .anim-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.34s both; }
        .anim-left { animation: slideRight 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .logo-float { animation: float 4s ease-in-out infinite; }
        .logo-glow  { animation: pulseGlow 3s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #F5A623 0%, #FCD34D 40%, #F5A623 70%, #D97706 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .spin-ring {
          animation: spinSlow 20s linear infinite;
        }
        .input-field {
          background: #F8FAFF;
          border: 1.5px solid #DBEAFE;
          color: #0A2342;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #0D47A1;
          box-shadow: 0 0 0 3px rgba(13,71,161,0.10);
          outline: none;
        }
        .input-error {
          border-color: #FECACA !important;
        }
        .btn-submit {
          background: linear-gradient(135deg, #0A2342 0%, #0D47A1 50%, #1565C0 100%);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 60%);
        }
        .btn-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(13,71,161,0.40);
        }
        .btn-submit:not(:disabled):active { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      <div className="min-h-screen flex overflow-hidden" style={{ background: '#060F1E' }}>

        {/* ══ LEFT PANEL ══ */}
        <div className="hidden lg:flex lg:w-[52%] relative flex-col items-center justify-center overflow-hidden">

          {/* Mosaic BG */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 opacity-[0.14]">
              {[
                '/images/hero/gedung-pemprov.jpeg',
                '/images/hero/komodo-padar.jpeg',
                '/images/hero/wae-rebo.jpeg',
                '/images/hero/sumba-tarung.jpeg',
                '/images/hero/geowisata-timor.jpeg',
                '/images/hero/panorama-laut.jpeg',
              ].map((src, i) => (
                <div key={i} className="relative overflow-hidden">
                  <Image src={src} alt="" fill className="object-cover" sizes="26vw" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(160deg, rgba(6,15,30,0.96) 0%, rgba(9,30,70,0.91) 50%, rgba(6,15,30,0.97) 100%)',
            }} />
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.03 }}>
              <defs>
                <pattern id="lp" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="50" x2="50" y2="0" stroke="#F5A623" strokeWidth="0.7" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lp)" />
            </svg>
          </div>

          {/* Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 65%)', transform: 'translate(30%,-30%)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(13,71,161,0.20) 0%, transparent 65%)', transform: 'translate(-30%,30%)' }} />

          {/* Content */}
          <div className={`relative z-10 px-14 text-center${mounted ? ' anim-left' : ' opacity-0'}`}>

            {/* Logo circle */}
            <div className="relative w-28 h-28 mx-auto mb-8 logo-glow rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(245,166,35,0.30)', backdropFilter: 'blur(8px)' }}>
              <div className="logo-float w-full h-full relative">
                <Image src="/images/logo-prov-ntt.png" alt="Logo NTT" fill className="object-contain p-4" sizes="112px" priority />
              </div>
              <div className="spin-ring absolute -inset-3 rounded-full"
                style={{ border: '1px dashed rgba(245,166,35,0.22)' }} />
            </div>

            {/* Title */}
            <h1 className="text-[2.6rem] font-black leading-tight mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              <span className="text-white">Biro </span>
              <span className="shimmer-text">Organisasi</span>
            </h1>
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Provinsi Nusa Tenggara Timur
            </p>
            <p className="text-[9px] tracking-widest uppercase mb-8" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Sekretariat Daerah
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-px w-14" style={{ background: 'rgba(245,166,35,0.35)' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F5A623' }} />
              <div className="h-px w-14" style={{ background: 'rgba(245,166,35,0.35)' }} />
            </div>

            <p className="text-sm leading-relaxed max-w-xs mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Melayani Dengan Sepenuh Hati demi terwujudnya Birokrasi yang bersih, efektif, dan akuntabel.
            </p>

            {/* BerAKHLAK */}
            <div className="inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 mb-10"
              style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.22)', backdropFilter: 'blur(6px)' }}>
              <ShieldCheck className="w-4 h-4" style={{ color: '#F5A623' }} />
              <span className="font-black text-xs tracking-[0.20em] uppercase" style={{ color: '#F5A623' }}>BerAKHLAK</span>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-10">
              {[{ num: '42', label: 'OPD' }, { num: '22', label: 'Kab/Kota' }, { num: '150+', label: 'Peraturan' }].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black" style={{ color: '#F5A623', fontFamily: 'var(--font-display)' }}>{s.num}</p>
                  <p className="text-[10px] mt-0.5 font-semibold" style={{ color: 'rgba(255,255,255,0.30)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.35), transparent)' }} />
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative"
          style={{ background: '#F4F7FD' }}>

          {/* Top stripe */}
          <div className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #0A2342, #0D47A1, #1E88E5, #F5A623, #0D47A1)' }} />

          {/* Corner decos */}
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none rounded-bl-full"
            style={{ background: 'rgba(13,71,161,0.04)' }} />
          <div className="absolute bottom-0 left-0 w-36 h-36 pointer-events-none rounded-tr-full"
            style={{ background: 'rgba(245,166,35,0.05)' }} />

          <div className="relative z-10 w-full max-w-sm">

            {/* Mobile logo */}
            <div className={`lg:hidden text-center mb-8${mounted ? ' anim-1' : ' opacity-0'}`}>
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0A1929, #0D47A1)', boxShadow: '0 8px 24px rgba(13,71,161,0.35)' }}>
                <Image src="/images/logo-prov-ntt.png" alt="Logo" fill className="object-contain p-2" sizes="64px" />
              </div>
              <p className="text-base font-black" style={{ color: '#0A2342', fontFamily: 'var(--font-heading)' }}>Biro Organisasi</p>
              <p className="text-[10px] font-black tracking-widest uppercase mt-0.5" style={{ color: '#F5A623' }}>Prov. NTT</p>
            </div>

            {/* Heading */}
            <div className={`mb-7${mounted ? ' anim-1' : ' opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(13,71,161,0.08)', border: '1px solid rgba(13,71,161,0.14)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#0D47A1' }} />
                <span className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: '#0D47A1' }}>
                  Panel Administrasi
                </span>
              </div>
              <h1 className="text-3xl font-black leading-tight"
                style={{ color: '#0A2342', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
                Selamat Datang
              </h1>
              <p className="text-sm mt-1.5" style={{ color: '#64748B' }}>
                Masuk untuk mengelola konten website
              </p>
              <div className="flex items-center gap-1.5 mt-3">
                <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
                <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
              </div>
            </div>

            {/* Form card */}
            <div className={`rounded-2xl overflow-hidden${mounted ? ' anim-2' : ' opacity-0'}`}
              style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 4px 30px rgba(13,71,161,0.10)' }}>

              {/* Card top bar */}
              <div className="px-6 py-3"
                style={{ background: 'linear-gradient(135deg, #0A1929 0%, #0D47A1 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.50)' }}>
                  Biro Organisasi Setda Prov. NTT
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4" noValidate>

                {/* Error alert */}
                {error && (
                  <div className="flex items-start gap-3 rounded-xl px-4 py-3 text-xs font-semibold"
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold" style={{ color: '#374151' }}>
                    Alamat Email <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    id="email" type="email" autoComplete="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@biroorganisasi.nttprov.go.id"
                    className={`input-field w-full px-4 py-3 rounded-xl text-sm${error ? ' input-error' : ''}`}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-bold" style={{ color: '#374151' }}>
                      Kata Sandi <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <Link href="/admin/lupa-password"
                      className="text-[10px] font-semibold hover:underline transition-colors"
                      style={{ color: '#1565C0' }}>
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password" type={showPass ? 'text' : 'password'}
                      autoComplete="current-password" required
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`input-field w-full px-4 py-3 pr-11 rounded-xl text-sm${error ? ' input-error' : ''}`}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-slate-600"
                      style={{ color: '#94A3B8' }} tabIndex={-1}>
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={isPending || !email || !password}
                  className="btn-submit w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white mt-1">
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Memproses…</>
                  ) : (
                    <><LogIn className="w-4 h-4" /> Masuk ke Panel Admin</>
                  )}
                </button>
              </form>
            </div>

            {/* Back link */}
            <div className={`mt-6 flex flex-col items-center gap-2${mounted ? ' anim-3' : ' opacity-0'}`}>
              <Link href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:gap-2.5 group"
                style={{ color: '#64748B' }}>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Kembali ke Beranda
              </Link>
              <p className="text-[10px] text-center" style={{ color: '#94A3B8' }}>
                Hanya untuk staf resmi Biro Organisasi Setda Prov. NTT
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}