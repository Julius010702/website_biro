'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, ChevronDown, ChevronRight, LogIn, Phone, Clock,
  Home, Users, Building2, Newspaper, Database, Shield
} from 'lucide-react'
import { mainNav, type NavItem } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const navIcons: Record<string, React.ReactNode> = {
  Beranda:            <Home className="w-3.5 h-3.5" />,
  Profil:             <Users className="w-3.5 h-3.5" />,
  'Unit Kerja':       <Building2 className="w-3.5 h-3.5" />,
  PPID:               <Shield className="w-3.5 h-3.5" />,
  Berita:             <Newspaper className="w-3.5 h-3.5" />,
  'Daftar Informasi': <Database className="w-3.5 h-3.5" />,
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeSub, setActiveSub]   = useState<string | null>(null)
  const pathname = usePathname()

  // Tutup menu saat navigasi
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
    setActiveMenu(null)
    setActiveSub(null)
  }

  // Cegah scroll body saat mobile menu terbuka
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    // ← wrapper sticky mencakup TOPBAR + NAVBAR sekaligus
    <div className="sticky top-0 z-50 w-full" style={{ background: 'var(--color-ntt-blue-900, #0A1929)' }}>

      {/* ── TOP BAR ── */}
      <div className="hidden md:flex items-center justify-between text-xs w-full overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Ticker */}
        <div className="flex items-center flex-1 min-w-0 overflow-hidden">
          <div className="shrink-0 flex items-center gap-2 px-3 py-2"
            style={{ background: 'rgba(245,166,35,0.12)', borderRight: '1px solid rgba(245,166,35,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: '#F5A623' }} />
            <span className="font-bold tracking-widest text-[10px] uppercase whitespace-nowrap" style={{ color: '#F5A623' }}>
              BIRO
            </span>
          </div>
          <div className="flex-1 min-w-0 overflow-hidden relative py-2">
            <div className="header-ticker-inner">
              {[0, 1].map((i) => (
                <span key={i} className="header-ticker-text" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>
                  <span style={{ color: '#F5A623', marginRight: '12px' }}>◆</span>
                  Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur
                  &nbsp;&nbsp;&nbsp;
                  <span style={{ color: '#F5A623', marginRight: '12px' }}>◆</span>
                  Mendukung Tata Kelola Pemerintahan yang Efektif, Efisien, dan Akuntabel
                  &nbsp;&nbsp;&nbsp;
                  <span style={{ color: '#F5A623', marginRight: '12px' }}>◆</span>
                  Nilai BerAKHLAK: Berorientasi Pelayanan · Akuntabel · Kompeten · Harmonis · Loyal · Adaptif · Kolaboratif
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Meta info */}
        <div className="shrink-0 flex items-center gap-4 px-4 py-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="w-3 h-3" style={{ color: '#F5A623' }} />
            Senin – Jumat: 08.00 – 16.00 WITA
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Phone className="w-3 h-3" style={{ color: '#F5A623' }} />
            (0380) 831021
          </span>
        </div>
      </div>

      {/* ── GOLD LINE ── */}
      <div className="hidden md:block h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #F5A623, #F5A623 60%, transparent)' }} />

      {/* ── MAIN NAVBAR ── */}
      <header className="w-full" style={{ background: 'var(--color-ntt-blue-900, #0A1929)', boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-11 h-11 shrink-0">
              <Image
                src="/images/logo-prov-ntt.png"
                alt="Logo Provinsi NTT"
                fill sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-white tracking-wide" style={{ fontSize: 'clamp(10px, 2vw, 13px)' }}>
                BIRO ORGANISASI
              </span>
              <span style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', color: 'rgba(255,255,255,0.5)' }}>
                Prov. Nusa Tenggara Timur
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {mainNav.map((item, i) => (
              <div key={item.label} className="flex items-center">
                {i > 0 && i === mainNav.length - 1 && (
                  <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.12)' }} />
                )}
                <DesktopNavItem
                  item={item}
                  active={activeMenu === item.label}
                  onHover={(label) => { setActiveMenu(label); setActiveSub(null) }}
                  onLeave={() => { setActiveMenu(null); setActiveSub(null) }}
                  activeSub={activeSub}
                  onSubHover={setActiveSub}
                  icon={navIcons[item.label]}
                />
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest"
              style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.25)', color: '#F5A623' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F5A623' }} />
              BerAKHLAK
            </div>
            <Link href="/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}>
              <LogIn className="w-3.5 h-3.5" />
              Login
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ top: 0 }}>
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(10,25,41,0.85)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden"
            style={{
              top: '112px', // tinggi topbar + navbar
              background: '#0A1929',
              borderTop: '1px solid rgba(245,166,35,0.2)',
            }}
          >
            <MobileNav items={mainNav} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── DESKTOP NAV ITEM ─── */
function DesktopNavItem({
  item, active, onHover, onLeave, activeSub, onSubHover, icon,
}: {
  item: NavItem
  active: boolean
  onHover: (label: string) => void
  onLeave: () => void
  activeSub: string | null
  onSubHover: (label: string) => void
  icon?: React.ReactNode
}) {
  const pathname   = usePathname()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isActive = item.href
    ? pathname === item.href
    : item.children?.some((c) =>
        c.href ? pathname.startsWith(c.href) : c.children?.some((cc) => cc.href && pathname.startsWith(cc.href))
      )

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (item.children) onHover(item.label)
  }
  const handleLeave = () => { closeTimer.current = setTimeout(() => onLeave(), 300) }
  const handleDropdownEnter = () => { if (closeTimer.current) clearTimeout(closeTimer.current) }

  const linkStyle = cn('header-nav-link', isActive && 'active')

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {item.href && !item.children ? (
        item.external
          ? <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkStyle}>{icon}{item.label}</a>
          : <Link href={item.href} className={linkStyle}>{icon}{item.label}</Link>
      ) : (
        <button className={cn('header-nav-link', (active || isActive) && 'active')}
          onClick={() => onHover(active ? '' : item.label)}>
          {icon}
          {item.label}
          {item.children && (
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', active && 'rotate-180')} />
          )}
        </button>
      )}

      {item.children && active && (
        <div className="header-dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleLeave}>
          <div className="header-dropdown-section-label px-4 py-1.5">{item.label}</div>
          {item.children.map((child) => (
            <SubItem key={child.label} child={child} activeSub={activeSub} onSubHover={onSubHover} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── SUB ITEM ─── */
function SubItem({ child, activeSub, onSubHover }: {
  child: NavItem; activeSub: string | null; onSubHover: (label: string) => void
}) {
  const subTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSubEnter = () => { if (subTimer.current) clearTimeout(subTimer.current); if (child.children) onSubHover(child.label) }
  const handleSubLeave = () => { subTimer.current = setTimeout(() => onSubHover(''), 300) }
  const handleSubDropdownEnter = () => { if (subTimer.current) clearTimeout(subTimer.current); onSubHover(child.label) }

  if (child.href && !child.children) {
    return child.external
      ? <a href={child.href} target="_blank" rel="noopener noreferrer" className="header-dropdown-link"><span>{child.label}</span></a>
      : <Link href={child.href} className="header-dropdown-link"><span>{child.label}</span></Link>
  }

  return (
    <div className="relative" onMouseEnter={handleSubEnter} onMouseLeave={handleSubLeave}>
      <button className={cn('header-dropdown-link w-full', activeSub === child.label && 'bg-white/5')}>
        <span>{child.label}</span>
        {child.children && <ChevronRight className={cn('w-3.5 h-3.5 shrink-0 ml-auto transition-transform duration-200', activeSub === child.label && 'text-ntt-hgold-400')} />}
      </button>
      {child.children && activeSub === child.label && (
        <div className="header-subdropdown" onMouseEnter={handleSubDropdownEnter} onMouseLeave={handleSubLeave}>
          <div className="header-dropdown-section-label px-4 py-1.5">{child.label}</div>
          {child.children.map((sub) =>
            sub.external
              ? <a key={sub.label} href={sub.href ?? '#'} target="_blank" rel="noopener noreferrer" className="header-dropdown-link"><span>{sub.label}</span></a>
              : <Link key={sub.label} href={sub.href ?? '#'} className="header-dropdown-link"><span>{sub.label}</span></Link>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── MOBILE NAV ─── */
function MobileNav({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string[]>([])
  const toggle = (label: string) =>
    setExpanded((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label])

  return (
    <div className="px-4 py-6 pb-28 w-full overflow-x-hidden">
      <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(245,166,35,0.6)' }}>
        Menu Navigasi
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <MobileNavItem key={item.label} item={item} expanded={expanded}
            onToggle={toggle} onClose={onClose} level={0} icon={navIcons[item.label]} />
        ))}
      </div>

      <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(245,166,35,0.15)' }}>
        <Link href="/login" onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
          style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.25)', color: '#F5A623' }}>
          <LogIn className="w-4 h-4" />
          Login Admin
        </Link>
      </div>

      <div className="mt-4 px-3 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Kontak</p>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <Phone className="w-3 h-3" style={{ color: '#F5A623' }} />
          (0380) 831021
        </div>
        <div className="flex items-center gap-2 text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <Clock className="w-3 h-3" style={{ color: '#F5A623' }} />
          Senin–Jumat 08.00–16.00 WITA
        </div>
      </div>
    </div>
  )
}

/* ─── MOBILE NAV ITEM ─── */
function MobileNavItem({ item, expanded, onToggle, onClose, level, icon }: {
  item: NavItem; expanded: string[]; onToggle: (label: string) => void
  onClose: () => void; level: number; icon?: React.ReactNode
}) {
  const isExpanded = expanded.includes(item.label)
  const pl = level === 0 ? 'pl-3' : level === 1 ? 'pl-8' : 'pl-12'

  if (item.href && !item.children) {
    return item.external
      ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClose}
          className={cn('header-mobile-link flex items-center gap-2.5', pl)}>
          {level === 0 && icon && <span style={{ color: 'rgba(245,166,35,0.7)' }}>{icon}</span>}
          {item.label}
        </a>
      ) : (
        <Link href={item.href} onClick={onClose}
          className={cn('header-mobile-link flex items-center gap-2.5', pl)}>
          {level === 0 && icon && <span style={{ color: 'rgba(245,166,35,0.7)' }}>{icon}</span>}
          {item.label}
        </Link>
      )
  }

  return (
    <div>
      <button onClick={() => onToggle(item.label)}
        className={cn('header-mobile-expand flex items-center gap-2.5 w-full', pl, isExpanded && 'open')}>
        <span className="flex items-center gap-2.5 flex-1 min-w-0">
          {level === 0 && icon && <span style={{ color: 'rgba(245,166,35,0.7)' }} className="shrink-0">{icon}</span>}
          <span className="truncate">{item.label}</span>
        </span>
        {item.children && (
          <ChevronDown className={cn('w-4 h-4 mr-3 shrink-0 transition-transform duration-200', isExpanded && 'rotate-180')} />
        )}
      </button>
      {isExpanded && item.children && (
        <div className="header-mobile-submenu">
          {item.children.map((child) => (
            <MobileNavItem key={child.label} item={child} expanded={expanded}
              onToggle={onToggle} onClose={onClose} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}