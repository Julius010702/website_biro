'use client'
// components/layout/Header.tsx
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
  Beranda:            <Home      className="w-3.5 h-3.5" />,
  Profil:             <Users     className="w-3.5 h-3.5" />,
  'Unit Kerja':       <Building2 className="w-3.5 h-3.5" />,
  PPID:               <Shield    className="w-3.5 h-3.5" />,
  Berita:             <Newspaper className="w-3.5 h-3.5" />,
  'Daftar Informasi': <Database  className="w-3.5 h-3.5" />,
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeSub,  setActiveSub]  = useState<string | null>(null)
  const pathname = usePathname()
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(112)

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (headerRef.current) ro.observe(headerRef.current)
    return () => ro.disconnect()
  }, [])

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
    setActiveMenu(null)
    setActiveSub(null)
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <div
        ref={headerRef}
        className="sticky top-0 left-0 right-0 z-50 w-full"
        id="site-header"
      >
        {/* ── TOPBAR ── */}
        <div className="hidden md:flex items-stretch w-full overflow-hidden header-topbar">
          {/* Ticker Label */}
          <div className="header-ticker-label flex items-center gap-2 px-3 py-0 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: 'var(--color-ntt-hgold-400)' }} />
            <span className="font-bold tracking-widest text-[10px] uppercase whitespace-nowrap header-topbar-text">
              BIRO
            </span>
          </div>

          {/* Ticker Track */}
          <div className="header-ticker-track flex-1 min-w-0 overflow-hidden relative">
            <div className="header-ticker-inner">
              {[0, 1].map((i) => (
                <span key={i} className="header-ticker-text">
                  <span className="header-ticker-dot">◆</span>
                  Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur&nbsp;&nbsp;&nbsp;
                  <span className="header-ticker-dot">◆</span>
                  Mendukung Tata Kelola Pemerintahan yang Efektif, Efisien, dan Akuntabel&nbsp;&nbsp;&nbsp;
                  <span className="header-ticker-dot">◆</span>
                  Nilai BerAKHLAK: Berorientasi Pelayanan · Akuntabel · Kompeten · Harmonis · Loyal · Adaptif · Kolaboratif&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>

          {/* Topbar Meta */}
          <div className="shrink-0 flex items-center gap-4 px-4 header-topbar-meta text-xs">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="w-3 h-3" style={{ color: 'var(--color-ntt-hgold-400)' }} />
              Senin – Jumat: 08.00 – 16.00 WITA
            </span>
            <span className="header-topbar-divider">|</span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Phone className="w-3 h-3" style={{ color: 'var(--color-ntt-hgold-400)' }} />
              (0380) 831021
            </span>
          </div>
        </div>

        {/* ── GOLD LINE ── */}
        <div className="gold-accent-line hidden md:block" />

        {/* ── MAIN NAVBAR ── */}
        <div className="header-main">
          <div className="header-nav-container">

            {/* Logo */}
            <Link href="/" className="header-logo-area group">
              <div className="header-logo-icon relative overflow-hidden">
                <Image
                  src="/images/logo-prov-ntt.png"
                  alt="Logo Provinsi NTT"
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div>
                <div className="header-logo-title">BIRO ORGANISASI</div>
                <div className="header-logo-sub">Prov. Nusa Tenggara Timur</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="header-nav-links-area hidden lg:flex">
              {mainNav.map((item, i) => (
                <div key={item.label} className="flex items-center">
                  {i > 0 && i === mainNav.length - 1 && (
                    <div className="header-nav-separator" />
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

            {/* Right Area */}
            <div className="header-nav-right-area">
              <div className="header-badge">
                <div className="header-badge-dot" />
                <span className="header-badge-text">BerAKHLAK</span>
              </div>
              <Link href="/login" className="header-btn-login hidden md:flex">
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="header-mobile-toggle"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Gold accent bottom line */}
          <div className="gold-accent-line" />
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(3,11,26,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="header-mobile-drawer absolute left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden"
            style={{ top: `${headerHeight}px` }}
          >
            <MobileNav items={mainNav} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Desktop Nav Item ─────────────────────────────────── */
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
        c.href
          ? pathname.startsWith(c.href)
          : c.children?.some((cc) => cc.href && pathname.startsWith(cc.href))
      )

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (item.children) onHover(item.label)
  }
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => onLeave(), 250)
  }
  const handleDropdownEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const linkCls = cn('header-nav-link', isActive && 'active')

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {item.href && !item.children ? (
        item.external ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
            {icon}{item.label}
          </a>
        ) : (
          <Link href={item.href} className={linkCls}>
            {icon}{item.label}
          </Link>
        )
      ) : (
        <button
          className={cn('header-nav-link', (active || isActive) && 'active')}
          onClick={() => onHover(active ? '' : item.label)}
        >
          {icon}
          {item.label}
          {item.children && (
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 transition-transform duration-200',
                active && 'rotate-180'
              )}
            />
          )}
        </button>
      )}

      {/* Dropdown */}
      {item.children && active && (
        <div
          className="header-dropdown"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleLeave}
        >
          <div className="header-dropdown-section-label">{item.label}</div>
          {item.children.map((child) => (
            <SubItem
              key={child.label}
              child={child}
              activeSub={activeSub}
              onSubHover={onSubHover}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Sub Item ─────────────────────────────────────────── */
function SubItem({
  child,
  activeSub,
  onSubHover,
}: {
  child: NavItem
  activeSub: string | null
  onSubHover: (label: string) => void
}) {
  const subTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSubEnter = () => {
    if (subTimer.current) clearTimeout(subTimer.current)
    if (child.children) onSubHover(child.label)
  }
  const handleSubLeave = () => {
    subTimer.current = setTimeout(() => onSubHover(''), 250)
  }
  const handleSubDropdownEnter = () => {
    if (subTimer.current) clearTimeout(subTimer.current)
    onSubHover(child.label)
  }

  if (child.href && !child.children) {
    return child.external ? (
      <a
        href={child.href}
        target="_blank"
        rel="noopener noreferrer"
        className="header-dropdown-link"
      >
        <span>{child.label}</span>
      </a>
    ) : (
      <Link href={child.href} className="header-dropdown-link">
        <span>{child.label}</span>
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleSubEnter}
      onMouseLeave={handleSubLeave}
    >
      <button
        className={cn(
          'header-dropdown-link w-full',
          activeSub === child.label && 'bg-white/5'
        )}
      >
        <span>{child.label}</span>
        {child.children && (
          <ChevronRight
            className={cn(
              'w-3.5 h-3.5 shrink-0 ml-auto transition-transform duration-200',
              activeSub === child.label && 'text-ntt-hgold-400'
            )}
          />
        )}
      </button>

      {/* Sub-dropdown */}
      {child.children && activeSub === child.label && (
        <div
          className="header-subdropdown"
          onMouseEnter={handleSubDropdownEnter}
          onMouseLeave={handleSubLeave}
        >
          <div className="header-dropdown-section-label">{child.label}</div>
          {child.children.map((sub) =>
            sub.external ? (
              <a
                key={sub.label}
                href={sub.href ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="header-dropdown-link"
              >
                <span>{sub.label}</span>
              </a>
            ) : (
              <Link
                key={sub.label}
                href={sub.href ?? '#'}
                className="header-dropdown-link"
              >
                <span>{sub.label}</span>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Mobile Nav ───────────────────────────────────────── */
function MobileNav({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string[]>([])
  const toggle = (label: string) =>
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )

  return (
    <div className="px-4 py-6 pb-28 w-full overflow-x-hidden">
      <p className="header-mobile-label">Menu Navigasi</p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <MobileNavItem
            key={item.label}
            item={item}
            expanded={expanded}
            onToggle={toggle}
            onClose={onClose}
            level={0}
            icon={navIcons[item.label]}
          />
        ))}
      </div>

      {/* Login */}
      <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(212,160,23,0.15)' }}>
        <Link
          href="/login"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold"
          style={{
            background: 'rgba(212,160,23,0.12)',
            border: '1px solid rgba(212,160,23,0.25)',
            color: 'var(--color-ntt-hgold-300)',
          }}
        >
          <LogIn className="w-4 h-4" />
          Login Admin
        </Link>
      </div>

      {/* Contact */}
      <div
        className="mt-4 px-3 py-3 rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-2"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Kontak
        </p>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <Phone className="w-3 h-3" style={{ color: 'var(--color-ntt-hgold-400)' }} />
          (0380) 831021
        </div>
        <div
          className="flex items-center gap-2 text-xs mt-1"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <Clock className="w-3 h-3" style={{ color: 'var(--color-ntt-hgold-400)' }} />
          Senin–Jumat 08.00–16.00 WITA
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile Nav Item ──────────────────────────────────── */
function MobileNavItem({
  item,
  expanded,
  onToggle,
  onClose,
  level,
  icon,
}: {
  item: NavItem
  expanded: string[]
  onToggle: (label: string) => void
  onClose: () => void
  level: number
  icon?: React.ReactNode
}) {
  const isExpanded = expanded.includes(item.label)
  const pl = level === 0 ? 'pl-3' : level === 1 ? 'pl-8' : 'pl-12'

  if (item.href && !item.children) {
    return item.external ? (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className={cn('header-mobile-link flex items-center gap-2.5', pl)}
      >
        {level === 0 && icon && (
          <span style={{ color: 'var(--color-ntt-hgold-400)', opacity: 0.8 }}>{icon}</span>
        )}
        {item.label}
      </a>
    ) : (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn('header-mobile-link flex items-center gap-2.5', pl)}
      >
        {level === 0 && icon && (
          <span style={{ color: 'var(--color-ntt-hgold-400)', opacity: 0.8 }}>{icon}</span>
        )}
        {item.label}
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={() => onToggle(item.label)}
        className={cn(
          'header-mobile-expand flex items-center gap-2.5 w-full',
          pl,
          isExpanded && 'open'
        )}
      >
        <span className="flex items-center gap-2.5 flex-1 min-w-0">
          {level === 0 && icon && (
            <span
              style={{ color: 'var(--color-ntt-hgold-400)', opacity: 0.8 }}
              className="shrink-0"
            >
              {icon}
            </span>
          )}
          <span className="truncate">{item.label}</span>
        </span>
        {item.children && (
          <ChevronDown
            className={cn(
              'w-4 h-4 mr-3 shrink-0 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        )}
      </button>

      {isExpanded && item.children && (
        <div className="header-mobile-submenu">
          {item.children.map((child) => (
            <MobileNavItem
              key={child.label}
              item={child}
              expanded={expanded}
              onToggle={onToggle}
              onClose={onClose}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}