'use client'
// components/sections/Header.tsx (atau components/Header.tsx)

import { useState, useRef } from 'react'
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
  const [activeSub, setActiveSub] = useState<string | null>(null)
  const pathname = usePathname()

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
    setActiveMenu(null)
    setActiveSub(null)
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="header-topbar hidden md:flex items-center justify-between text-xs overflow-hidden">
        <div className="flex items-center flex-1 min-w-0 overflow-hidden">
          <div className="header-ticker-label shrink-0 flex items-center gap-2 px-3 py-2 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-ntt-hgold-400 animate-pulse inline-block" />
            <span className="header-topbar-text font-bold tracking-widest text-[10px] uppercase whitespace-nowrap">
              BIRO
            </span>
          </div>
          <div className="header-ticker-track flex-1 min-w-0 overflow-hidden relative py-2">
            <div className="header-ticker-inner">
              {[0, 1].map((i) => (
                <span key={i} className="header-ticker-text">
                  <span className="header-ticker-dot">◆</span>
                  Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur
                  &nbsp;&nbsp;&nbsp;
                  <span className="header-ticker-dot">◆</span>
                  Mendukung Tata Kelola Pemerintahan yang Efektif, Efisien, dan Akuntabel
                  &nbsp;&nbsp;&nbsp;
                  <span className="header-ticker-dot">◆</span>
                  Nilai BerAKHLAK: Berorientasi Pelayanan · Akuntabel · Kompeten · Harmonis · Loyal · Adaptif · Kolaboratif
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 header-topbar-meta shrink-0 px-4 py-2">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="w-3 h-3 text-ntt-hgold-400" />
            Senin – Jumat: 08.00 – 16.00 WITA
          </span>
          <span className="header-topbar-divider">|</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Phone className="w-3 h-3 text-ntt-hgold-400" />
            (0380) 831021
          </span>
        </div>
      </div>

      {/* GOLD ACCENT LINE */}
      <div className="gold-accent-line hidden md:block" />

      {/* MAIN HEADER */}
      <header className="header-main sticky top-0 z-50 isolate">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-ntt-hgold-400/5 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-16 bg-ntt-navy-400/10 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 h-17.5 flex items-center justify-between gap-4">
          {/* Logo — ✅ FIX: tambah sizes prop */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="header-logo-icon relative w-12 h-12">
              <Image
                src="/images/logo-prov-ntt.png"
                alt="Logo Provinsi Nusa Tenggara Timur"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="header-logo-title">BIRO ORGANISASI</span>
              <span className="header-logo-sub">Prov. Nusa Tenggara Timur</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {mainNav.map((item, i) => (
              <div key={item.label} className="flex items-center">
                {i > 0 && i === mainNav.length - 1 && (
                  <div className="header-nav-separator mx-1" />
                )}
                <DesktopNavItem
                  item={item}
                  active={activeMenu === item.label}
                  onHover={(label) => {
                    setActiveMenu(label)
                    setActiveSub(null)
                  }}
                  onLeave={() => {
                    setActiveMenu(null)
                    setActiveSub(null)
                  }}
                  activeSub={activeSub}
                  onSubHover={setActiveSub}
                  icon={navIcons[item.label]}
                />
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <div className="header-badge">
              <span className="header-badge-dot" />
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
      </header>

      {/* MOBILE MENU OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ntt-blue-900/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-17.75 left-0 right-0 bottom-0 header-mobile-drawer overflow-y-auto">
            <MobileNav items={mainNav} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

/* ─── DESKTOP NAV ITEM ─── */
function DesktopNavItem({
  item,
  active,
  onHover,
  onLeave,
  activeSub,
  onSubHover,
  icon,
}: {
  item: NavItem
  active: boolean
  onHover: (label: string) => void
  onLeave: () => void
  activeSub: string | null
  onSubHover: (label: string) => void
  icon?: React.ReactNode
}) {
  const pathname = usePathname()
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
    closeTimer.current = setTimeout(() => onLeave(), 300)
  }

  const handleDropdownEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {item.href && !item.children ? (
        item.external ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('header-nav-link', isActive && 'active')}
          >
            {icon}
            {item.label}
          </a>
        ) : (
          <Link href={item.href} className={cn('header-nav-link', isActive && 'active')}>
            {icon}
            {item.label}
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
              className={cn('w-3.5 h-3.5 transition-transform duration-200', active && 'rotate-180')}
            />
          )}
        </button>
      )}

      {item.children && active && (
        <div
          className="header-dropdown"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleLeave}
        >
          <div className="header-dropdown-section-label px-4 py-1.5">{item.label}</div>
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

/* ─── SUB ITEM ─── */
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
    subTimer.current = setTimeout(() => onSubHover(''), 300)
  }

  const handleSubDropdownEnter = () => {
    if (subTimer.current) clearTimeout(subTimer.current)
    onSubHover(child.label)
  }

  if (child.href && !child.children) {
    if (child.external) {
      return (
        <a
          href={child.href}
          target="_blank"
          rel="noopener noreferrer"
          className="header-dropdown-link"
        >
          <span>{child.label}</span>
        </a>
      )
    }
    return (
      <Link href={child.href} className="header-dropdown-link">
        <span>{child.label}</span>
      </Link>
    )
  }

  return (
    <div className="relative" onMouseEnter={handleSubEnter} onMouseLeave={handleSubLeave}>
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

      {child.children && activeSub === child.label && (
        <div
          className="header-subdropdown"
          onMouseEnter={handleSubDropdownEnter}
          onMouseLeave={handleSubLeave}
        >
          <div className="header-dropdown-section-label px-4 py-1.5">{child.label}</div>
          {child.children.map((sub) => {
            if (sub.external) {
              return (
                <a
                  key={sub.label}
                  href={sub.href ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-dropdown-link"
                >
                  <span>{sub.label}</span>
                </a>
              )
            }
            return (
              <Link key={sub.label} href={sub.href ?? '#'} className="header-dropdown-link">
                <span>{sub.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── MOBILE NAV ─── */
function MobileNav({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string[]>([])

  const toggle = (label: string) =>
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-5 px-3 py-3 rounded-xl bg-ntt-blue-800/60 border border-ntt-hgold-400/15 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-ntt-hgold-400 to-ntt-gold-600 flex items-center justify-center text-ntt-blue-950 font-bold text-xs">
          BO
        </div>
        <div>
          <p className="text-ntt-hgold-300 text-xs font-bold tracking-wide">BIRO ORGANISASI</p>
          <p className="text-ntt-blue-200/60 text-[10px]">Prov. Nusa Tenggara Timur</p>
        </div>
      </div>

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

      <div className="mt-8 pt-6 border-t border-ntt-hgold-400/20">
        <Link
          href="/login"
          onClick={onClose}
          className="header-btn-login justify-center py-3 rounded-xl w-full"
        >
          <LogIn className="w-4 h-4" />
          Login Admin
        </Link>
      </div>

      <div className="mt-4 px-3 py-3 rounded-xl bg-ntt-navy-800/40 border border-white/5">
        <p className="text-ntt-navy-200/50 text-[10px] font-bold uppercase tracking-widest mb-2">
          Kontak
        </p>
        <div className="flex items-center gap-2 text-xs text-ntt-navy-200/70">
          <Phone className="w-3 h-3 text-ntt-hgold-400" />
          (0380) 831021
        </div>
        <div className="flex items-center gap-2 text-xs text-ntt-navy-200/70 mt-1">
          <Clock className="w-3 h-3 text-ntt-hgold-400" />
          Senin–Jumat 08.00–16.00 WITA
        </div>
      </div>
    </div>
  )
}

/* ─── MOBILE NAV ITEM ─── */
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
    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={cn('header-mobile-link flex items-center gap-2.5', pl)}
        >
          {level === 0 && icon && <span className="text-ntt-hgold-400/70">{icon}</span>}
          {item.label}
        </a>
      )
    }
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn('header-mobile-link flex items-center gap-2.5', pl)}
      >
        {level === 0 && icon && <span className="text-ntt-hgold-400/70">{icon}</span>}
        {item.label}
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={() => onToggle(item.label)}
        className={cn('header-mobile-expand flex items-center gap-2.5', pl, isExpanded && 'open')}
      >
        <span className="flex items-center gap-2.5 flex-1">
          {level === 0 && icon && <span className="text-ntt-hgold-400/70">{icon}</span>}
          {item.label}
        </span>
        {item.children && (
          <ChevronDown
            className={cn('w-4 h-4 mr-3 transition-transform duration-200', isExpanded && 'rotate-180')}
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