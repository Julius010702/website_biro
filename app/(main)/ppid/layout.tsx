// app/(public)/ppid/layout.tsx
import type { Metadata } from 'next'
import Link             from 'next/link'
import { ppidMenu }     from '@/lib/navigation'
import {
  Shield, ChevronRight,
  FileText, Users, Heart,
  AlertTriangle, Lock, List,
  MessageSquare, MapPin, BookOpen,
} from 'lucide-react'

export const metadata: Metadata = {
  title: {
    template: '%s | PPID | Biro Organisasi Setda NTT',
    default:  'PPID | Biro Organisasi Setda NTT',
  },
}

const menuIcons: Record<string, React.ReactNode> = {
  '/ppid':                  <BookOpen      className="w-4 h-4" />,
  '/ppid/tugas-fungsi':     <FileText      className="w-4 h-4" />,
  '/ppid/struktur-organisasi': <Users      className="w-4 h-4" />,
  '/ppid/maklumat':         <Heart         className="w-4 h-4" />,
  '/ppid/prosedur-bencana': <AlertTriangle className="w-4 h-4" />,
  '/ppid/sk-dikecualikan':  <Lock          className="w-4 h-4" />,
  '/ppid/daftar-informasi': <List          className="w-4 h-4" />,
  '/ppid/permohonan':       <MessageSquare className="w-4 h-4" />,
  '/ppid/alamat':           <MapPin        className="w-4 h-4" />,
}

export default function PPIDLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* ── Top bar ── */}
      <div
        className="py-3 px-4"
        style={{ background: 'linear-gradient(90deg, #0A2342, #0D47A1)', borderBottom: '3px solid #F5A623' }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-white/60">
          <Shield className="w-3.5 h-3.5 text-yellow-400" />
          <Link href="/" className="hover:text-white transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/90 font-medium">PPID</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-4 gap-8" style={{ background: '#F4F7FD', minHeight: '80vh' }}>

        {/* ── Sidebar ── */}
        <aside className="lg:col-span-1">
          <div
            className="rounded-2xl overflow-hidden sticky top-24"
            style={{ background: 'white', border: '1px solid #DBEAFE', boxShadow: '0 2px 16px rgba(13,71,161,0.07)' }}
          >
            {/* Sidebar header */}
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #0A2342, #0D47A1)' }}
            >
              <Shield className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">Menu</p>
                <p className="text-sm font-bold text-white leading-tight">PPID</p>
              </div>
            </div>

            {/* Menu items */}
            <nav className="p-2">
              {ppidMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:bg-blue-50 group"
                  style={{ textDecoration: 'none', color: '#1E3A5F' }}
                >
                  <span
                    className="shrink-0 transition-colors group-hover:text-blue-600"
                    style={{ color: '#94A3B8' }}
                  >
                    {menuIcons[item.href] ?? <FileText className="w-4 h-4" />}
                  </span>
                  <span className="leading-snug group-hover:text-blue-700">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Divider + kontak */}
            <div className="mx-4 mb-4 p-3 rounded-xl" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
              <p className="text-[10px] font-bold text-orange-700 mb-1">Butuh Bantuan?</p>
              <p className="text-[10px] text-orange-600 leading-snug">
                Hubungi kami di jam kerja<br />Senin–Jumat, 08.00–16.00 WITA
              </p>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  )
}