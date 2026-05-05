import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { MapPin, Phone, Mail, Clock, Globe, ExternalLink, ArrowRight, Shield, Navigation } from 'lucide-react'
import { footerLinks } from '@/lib/navigation'
import FooterSocialButtons from './FooterSocialButtons'

type SosmedVal = { platform: string; url: string; aktif: boolean }

function KontakIcon({ ikon }: { ikon: string | null }) {
  const cls = 'w-3.5 h-3.5 shrink-0'
  switch (ikon) {
    case 'MapPin': return <MapPin className={cls + ' mt-0.5'} />
    case 'Phone': return <Phone className={cls} />
    case 'Mail': return <Mail className={cls} />
    case 'Clock': return <Clock className={cls} />
    default: return <Globe className={cls} />
  }
}

async function getFooterData() {
  const [kontakList, situsList, sosmedSettings] = await Promise.all([
    prisma.informasiKontak.findMany({ orderBy: { urutan: 'asc' } }),
    prisma.situsTerkait.findMany({ where: { aktif: true }, orderBy: { urutan: 'asc' } }),
    prisma.siteSettings.findMany({ where: { key: { startsWith: 'sosmed_' } } }),
  ])
  const sosmedList = sosmedSettings.map(function(s) {
    try { return JSON.parse(s.value) as SosmedVal } catch { return null }
  }).filter(function(s): s is SosmedVal { return s !== null && s.aktif })
  return { kontakList, situsList, sosmedList }
}

const values = ['Berorientasi Pelayanan', 'Akuntabel', 'Kompeten', 'Harmonis', 'Loyal', 'Adaptif', 'Kolaboratif']

export default async function Footer() {
  const { kontakList, situsList, sosmedList } = await getFooterData()
  const year = new Date().getFullYear()
  return (
    <footer className="footer-root">
      <div className="footer-gradient-bar" />
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="footer-logo-ring relative w-14 h-14 rounded-xl p-0.5 shrink-0">
                <div className="footer-logo-inner w-full h-full rounded-xl overflow-hidden relative">
                  <Image src="/images/logo-prov-ntt.png" alt="Logo Provinsi NTT" fill className="object-contain p-1" />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Biro Organisasi</p>
                <p className="footer-brand-desc text-[10px] tracking-wider uppercase mt-0.5">Setda Provinsi NTT</p>
              </div>
            </div>
            <p className="footer-brand-desc text-xs leading-relaxed mb-5">Mendukung tata kelola pemerintahan yang efektif, efisien, dan akuntabel demi pelayanan publik terbaik bagi masyarakat Nusa Tenggara Timur.</p>
            <FooterSocialButtons sosmedList={sosmedList} />
          </div>
          <div>
            <h3 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full" style={{ backgroundColor: 'var(--color-ntt-hgold-400)' }} />
              Profil
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.profil.map(function(link) {
                return (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-nav-link text-xs flex items-center gap-2 transition-colors group">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full" style={{ backgroundColor: 'var(--color-ntt-hgold-400)' }} />
              Situs Terkait
            </h3>
            <ul className="space-y-2.5 mb-8">
              {situsList.length > 0 ? situsList.map(function(s) {
                return (
                  <li key={s.id}>
                    <Link href={s.href} target={s.external ? '_blank' : undefined} rel={s.external ? 'noopener noreferrer' : undefined}
                      className="footer-nav-link text-xs flex items-center gap-2 transition-colors group">
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-50 group-hover:opacity-100" />
                      {s.label}
                    </Link>
                  </li>
                )
              }) : <li className="text-xs opacity-40 text-white">Belum ada situs terkait.</li>}
            </ul>
            <h3 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full" style={{ backgroundColor: 'var(--color-ntt-hgold-400)' }} />
              Kontak
            </h3>
            <ul className="space-y-3.5">
              {kontakList.map(function(k, i) {
                return (
                  <li key={k.id ?? i} className="footer-contact-row flex items-start gap-2.5 text-xs">
                    <span style={{ color: 'var(--color-ntt-hgold-400)' }}><KontakIcon ikon={k.ikon} /></span>
                    <span>{k.nilai}</span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full" style={{ backgroundColor: 'var(--color-ntt-hgold-400)' }} />
              Lokasi Kami
            </h3>
            <div className="rounded-xl overflow-hidden mb-3" style={{ border: '1px solid rgba(255,255,255,0.10)', position: 'relative' }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.3!2d123.6069!3d-10.1718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c36e47e3c6a9f0b%3A0xd09a7d4b4e6f2b1a!2sBiro%20Organisasi%20Setda%20Provinsi%20NTT!5e0!3m2!1sid!2sid!4v1714000000000!5m2!1sid!2sid"
                width="100%" height="200" style={{ border: 0, display: 'block', filter: 'grayscale(20%) contrast(1.05)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Lokasi Biro Organisasi Setda NTT" />
              <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(7,20,40,0.5), transparent)' }} />
            </div>
            <a href="https://maps.app.goo.gl/pV5TojTr4xGAc4F68" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'rgba(245,166,35,0.10)', border: '1px solid rgba(245,166,35,0.25)', color: 'var(--color-ntt-hgold-300)' }}>
              <Navigation className="w-3.5 h-3.5" /> Buka di Google Maps
            </a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
            <div className="flex items-center gap-1.5 mr-3">
              <Shield className="w-3.5 h-3.5" style={{ color: 'var(--color-ntt-hgold-400)' }} />
              <span className="text-[10px] font-bold tracking-widest text-white">BerAKHLAK</span>
            </div>
            {values.map(function(v, i) {
              return (
                <span key={v}>
                  <span className="footer-values-pill text-[10px] px-2.5 py-1 rounded-full font-medium">{v}</span>
                  {i < values.length - 1 && <span className="mx-1" style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>}
                </span>
              )
            })}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="footer-bottom-text text-xs">© {year} Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur. Hak cipta dilindungi undang-undang. | By Julius Djami</p>
          <div className="flex items-center gap-4">
            {[{ label: 'Kebijakan Privasi', href: '#' }, { label: 'Syarat Penggunaan', href: '#' }, { label: 'Peta Situs', href: '#' }].map(function(link) {
              return <Link key={link.label} href={link.href} className="footer-bottom-link text-xs transition-colors hover:underline">{link.label}</Link>
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
