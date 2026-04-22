'use client'
// src/components/layout/MobileBottomNav.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Newspaper, Shield } from 'lucide-react'

const mobileNavItems = [
  { label: 'Beranda', href: '/',                       icon: Home      },
  { label: 'Profil',  href: '/profil/sekapur-sirih',   icon: Users     },
  { label: 'Berita',  href: '/berita',                  icon: Newspaper },
  { label: 'PPID',    href: '/ppid',                    icon: Shield    },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch h-16">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors"
              style={{ color: isActive ? 'var(--color-ntt-blue-700)' : '#6B7280', textDecoration: 'none' }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                  style={{ width: '32px', height: '3px', background: 'var(--color-ntt-blue-700)' }}
                />
              )}

              {/* Icon wrapper — filled bg when active */}
              <span
                className="flex items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  width: '36px', height: '28px',
                  background: isActive ? 'rgba(27,95,168,0.10)' : 'transparent',
                }}
              >
                <Icon
                  className="w-4.5 h-4.5"
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </span>

              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: isActive ? 'var(--color-ntt-blue-700)' : '#9CA3AF' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}