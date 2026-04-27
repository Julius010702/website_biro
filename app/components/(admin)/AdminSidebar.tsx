'use client'
// components/admin/AdminSidebar.tsx
import { usePathname } from 'next/navigation'
import Link            from 'next/link'
import Image           from 'next/image'
import {
  LayoutDashboard, Newspaper, MessageSquare,
  AlertTriangle, Settings, ChevronDown,
  Building2, Shield,
  Camera, Globe,
} from 'lucide-react'
import { useState } from 'react'

type NavChild = { label: string; href: string }
type NavItem  = {
  label:    string
  href?:    string
  icon:     React.ReactNode
  children?: NavChild[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href:  '/admin',
    icon:  <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: 'Profil',
    icon:  <Building2 className="w-4 h-4" />,
    children: [
      { label: 'Sekapur Sirih',        href: '/admin/profil/sekapur-sirih' },
      { label: 'Struktur Organisasi',  href: '/admin/profil/struktur-organisasi' },
      { label: 'Tugas Pokok & Fungsi', href: '/admin/profil/tupoksi' },
      { label: 'Bagian',               href: '/admin/profil/bagian' },
    ],
  },
  {
    label: 'Beranda',
    icon:  <Globe className="w-4 h-4" />,
    children: [
      { label: 'Slider Beranda', href: '/admin/beranda/slider' },
      { label: 'Statistik',      href: '/admin/beranda/statistik' },
    ],
  },
  {
    label: 'Berita',
    href:  '/admin/berita',
    icon:  <Newspaper className="w-4 h-4" />,
  },
  {
    label: 'Galeri',
    href:  '/admin/galeri',
    icon:  <Camera className="w-4 h-4" />,
  },
  {
    label: 'PPID',
    icon:  <Shield className="w-4 h-4" />,
    children: [
      { label: 'Seputar PPID',             href: '/admin/ppid/seputar' },
      { label: 'Tugas & Fungsi',           href: '/admin/ppid/tugas-fungsi' },
      { label: 'Struktur Organisasi',      href: '/admin/ppid/struktur-organisasi' },
      { label: 'Maklumat Pelayanan',       href: '/admin/ppid/maklumat' },
      { label: 'Pelayanan Informasi',      href: '/admin/ppid/pelayanan' },
      { label: 'Informasi Publik',         href: '/admin/ppid/informasi-publik' },
      { label: 'Permohonan Online',        href: '/admin/ppid/permohonan' },
      
    ],
  },
  {
    label: 'Kontak',
    href:  '/admin/kontak',
    icon:  <MessageSquare className="w-4 h-4" />,
  },
  {
    label: 'Pengaduan (WBS)',
    href:  '/admin/pengaduan',
    icon:  <AlertTriangle className="w-4 h-4" />,
  },
  {
    label: 'Pengaturan',
    href:  '/admin/pengaturan',
    icon:  <Settings className="w-4 h-4" />,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  // Auto-expand grup yang aktif
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    navItems
      .filter((n) => n.children?.some((c) => pathname.startsWith(c.href)))
      .map((n) => n.label)
  )

  function toggleGroup(label: string) {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="flex flex-col h-full shrink-0"
      style={{
        width: '220px',
        background: '#0A1929',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Brand ── */}
      <div
        className="flex items-center gap-3 px-4 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <Image
            src="/images/logo-prov-ntt.png"
            alt="Logo NTT"
            fill
            sizes="36px"
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white leading-tight truncate">Biro Organisasi</p>
          <p className="text-[10px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Setda Prov. NTT
          </p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {navItems.map((item) => {
          // ── Single link ──
          if (!item.children) {
            const active = isActive(item.href!)
            return (
              <Link
                key={item.label}
                href={item.href!}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{
                  background: active ? 'rgba(255,255,255,0.1)'  : 'transparent',
                  color:      active ? 'white'                   : 'rgba(255,255,255,0.5)',
                  borderLeft: active ? '2px solid #F5A623'       : '2px solid transparent',
                }}
              >
                <span style={{ color: active ? '#F5A623' : 'rgba(255,255,255,0.35)' }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          }

          // ── Group with children ──
          const isOpen      = openGroups.includes(item.label)
          const groupActive = item.children.some((c) => pathname.startsWith(c.href))

          return (
            <div key={item.label}>
              <button
                onClick={() => toggleGroup(item.label)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{
                  background: groupActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color:      groupActive ? 'white' : 'rgba(255,255,255,0.5)',
                  border:     'none',
                  cursor:     'pointer',
                  borderLeft: groupActive ? '2px solid #F5A623' : '2px solid transparent',
                }}
              >
                <span style={{ color: groupActive ? '#F5A623' : 'rgba(255,255,255,0.35)' }}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform duration-200"
                  style={{
                    color: 'rgba(255,255,255,0.25)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Children */}
              {isOpen && (
                <div
                  className="ml-4 mt-0.5 mb-1 flex flex-col gap-0.5 pl-3"
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {item.children.map((child) => {
                    const childActive = pathname.startsWith(child.href)
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                        style={{
                          color:      childActive ? 'white'                  : 'rgba(255,255,255,0.42)',
                          background: childActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                        }}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* ── Footer sidebar ── */}
      <div
        className="px-4 py-3 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-[9px] font-medium text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2025 Biro Organisasi Setda NTT
        </p>
      </div>
    </aside>
  )
}