// app/(public)/berita/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Berita | Biro Organisasi Setda NTT',
    default:  'Berita | Biro Organisasi Setda NTT',
  },
}

export default function BeritaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}