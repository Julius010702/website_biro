// src/app/(public)/page.tsx
import HeroSection from '@/components/sections/HeroSection'
import BeritaSection from '@/components/sections/BeritaSection'
import GaleriSection from '@/components/sections/GaleriSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Selamat datang di website resmi Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BeritaSection />
      <GaleriSection />
    </>
  )
}