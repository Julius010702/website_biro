// app/(public)/informasi/galeri/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Galeri | Biro Organisasi Setda NTT',
    default:  'Galeri | Biro Organisasi Setda NTT',
  },
}

export default function GaleriLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}