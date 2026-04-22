// src/components/ui/PageHeader.tsx
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  className?: string
}

export default function PageHeader({ title, subtitle, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn('bg-linear-to-r from-ntt-red-800 via-ntt-red-700 to-ntt-red-800 text-white relative overflow-hidden', className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ntt-gold-500 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-white/70 mb-3 flex-wrap">
            <Link href="/" className="flex items-center hover:text-ntt-gold-300 transition-colors">
              <Home className="w-3 h-3" />
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-ntt-gold-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="font-display font-bold text-2xl md:text-3xl text-white">{title}</h1>
        {subtitle && (
          <p className="text-white/80 text-sm mt-2 max-w-2xl">{subtitle}</p>
        )}

        {/* Gold underline */}
        <div className="mt-4 w-16 h-1 bg-ntt-gold-400 rounded-full" />
      </div>
    </div>
  )
}
