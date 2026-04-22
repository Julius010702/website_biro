// app/(public)/unit-kerja/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Unit Kerja | Biro Organisasi Setda NTT',
    default:  'Unit Kerja | Biro Organisasi Setda NTT',
  },
}

export default function UnitKerjaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}