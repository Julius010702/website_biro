'use client'

// components/layout/Footer.tsx
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { footerLinks } from '@/lib/navigation'
import {
  MapPin, Phone, Mail, Clock,
  ExternalLink, ArrowRight,
  Shield, Navigation,
} from 'lucide-react'

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

type SocialLink = {
  icon: React.ReactNode
  href: string
  label: string
  hoverBg: string
}

function SocialButton({ icon, href, label, hoverBg }: SocialLink) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '36px', height: '36px', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? hoverBg : 'rgba(255,255,255,0.08)',
        border: `1px solid ${hovered ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
        color: 'rgba(255,255,255,0.9)',
        transition: 'all 0.2s ease',
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        flexShrink: 0,
      }}>
      {icon}
    </Link>
  )
}

const socialLinks: SocialLink[] = [
  { icon: <InstagramIcon />, href: 'https://www.instagram.com/organisasi_nttprov/', label: 'Instagram', hoverBg: 'rgba(225,48,108,0.9)' },
  { icon: <YoutubeIcon />,   href: 'https://youtube.com',                           label: 'YouTube',   hoverBg: 'rgba(255,0,0,0.9)' },
]

const values = ['Berorientasi Pelayanan','Akuntabel','Kompeten','Harmonis','Loyal','Adaptif','Kolaboratif']

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer-root">

      {/* Top gradient bar */}
      <div className="footer-gradient-bar" />

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── COL 1: Branding ── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="footer-logo-ring relative w-14 h-14 rounded-xl p-0.5 shrink-0">
                <div className="footer-logo-inner w-full h-full rounded-xl overflow-hidden relative">
                  <Image src="/images/logo-prov-ntt.png" alt="Logo Provinsi NTT" fill className="object-contain p-1" />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  Biro Organisasi
                </p>
                <p className="footer-brand-desc text-[10px] tracking-wider uppercase mt-0.5">
                  Setda Provinsi NTT
                </p>
              </div>
            </div>
            <p className="footer-brand-desc text-xs leading-relaxed mb-5">
              Mendukung tata kelola pemerintahan yang efektif, efisien, dan akuntabel demi pelayanan
              publik terbaik bagi masyarakat Nusa Tenggara Timur.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((s) => <SocialButton key={s.label} {...s} />)}
            </div>
          </div>

          {/* ── COL 2: Profil ── */}
          <div>
            <h3 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full" style={{ backgroundColor: 'var(--color-ntt-hgold-400)' }} />
              Profil
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.profil.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-nav-link text-xs flex items-center gap-2 transition-colors group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: Situs Terkait + Kontak ── */}
          <div>
            <h3 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full" style={{ backgroundColor: 'var(--color-ntt-hgold-400)' }} />
              Situs Terkait
            </h3>
            <ul className="space-y-2.5 mb-8">
              {footerLinks.situsTerkait.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="footer-nav-link text-xs flex items-center gap-2 transition-colors group">
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-50 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full" style={{ backgroundColor: 'var(--color-ntt-hgold-400)' }} />
              Kontak
            </h3>
            <ul className="space-y-3.5">
              {[
                { icon: <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />, text: 'Jl. Basuki Rahmat No. 1, Kelapa Lima, Kupang, NTT 85111' },
                { icon: <Phone  className="w-3.5 h-3.5 shrink-0" />,        text: '(0380) 831021' },
                { icon: <Mail   className="w-3.5 h-3.5 shrink-0" />,        text: 'biroorganisasi@nttprov.go.id' },
                { icon: <Clock  className="w-3.5 h-3.5 shrink-0" />,        text: 'Senin – Jumat: 08.00 – 16.00 WITA' },
              ].map((item, i) => (
                <li key={i} className="footer-contact-row flex items-start gap-2.5 text-xs">
                  <span style={{ color: 'var(--color-ntt-hgold-400)' }}>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 4: Peta Lokasi ── */}
          <div>
            <h3 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full" style={{ backgroundColor: 'var(--color-ntt-hgold-400)' }} />
              Lokasi Kami
            </h3>

            {/* Map embed */}
            <div className="rounded-xl overflow-hidden mb-3"
              style={{ border: '1px solid rgba(255,255,255,0.10)', position: 'relative' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.3!2d123.6069!3d-10.1718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c36e47e3c6a9f0b%3A0xd09a7d4b4e6f2b1a!2sBiro%20Organisasi%20Setda%20Provinsi%20NTT!5e0!3m2!1sid!2sid!4v1714000000000!5m2!1sid!2sid"
                width="100%"
                height="200"
                style={{ border: 0, display: 'block', filter: 'grayscale(20%) contrast(1.05)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Biro Organisasi Setda NTT"
              />
              {/* Overlay gradient bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(7,20,40,0.5), transparent)' }} />
            </div>

            {/* Buka di Google Maps */}
            <a
              href="https://maps.app.goo.gl/pV5TojTr4xGAc4F68"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(245,166,35,0.10)',
                border: '1px solid rgba(245,166,35,0.25)',
                color: 'var(--color-ntt-hgold-300)',
              }}
            >
              <Navigation className="w-3.5 h-3.5" />
              Buka di Google Maps
            </a>
          </div>

        </div>
      </div>

      {/* ── BerAKHLAK values bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
            <div className="flex items-center gap-1.5 mr-3">
              <Shield className="w-3.5 h-3.5" style={{ color: 'var(--color-ntt-hgold-400)' }} />
              <span className="text-[10px] font-bold tracking-widest text-white">BerAKHLAK</span>
            </div>
            {values.map((v, i) => (
              <span key={v}>
                <span className="footer-values-pill text-[10px] px-2.5 py-1 rounded-full font-medium">{v}</span>
                {i < values.length - 1 && <span className="mx-1" style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="footer-bottom-text text-xs">
  © {year} Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur. Hak cipta dilindungi undang-undang. | By Julius Djami
</p>  <div className="flex items-center gap-4">
            {[
              { label: 'Kebijakan Privasi', href: '#' },
              { label: 'Syarat Penggunaan', href: '#' },
              { label: 'Peta Situs',        href: '#' },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="footer-bottom-link text-xs transition-colors hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}