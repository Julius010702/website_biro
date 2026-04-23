// components/sections/HeroSection.tsx
import { prisma } from '@/lib/prisma'
import HeroSlider from './HeroSlider'

export default async function HeroSection() {
  const [slides, stats, taglineSetting] = await Promise.all([
    prisma.sliderBeranda.findMany({
      where: { aktif: true },
      orderBy: { urutan: 'asc' },
    }),
    prisma.statistikBeranda.findMany({
      orderBy: { urutan: 'asc' },
    }),
    prisma.siteSettings.findUnique({ where: { key: 'site_tagline' } }),
  ])

  return (
    <HeroSlider
      slides={slides}
      stats={stats.map((s) => ({
        id: s.id,
        nilai: s.nilai,
        label: s.label,
        ikon: s.ikon ?? '',
      }))}
      tagline={taglineSetting?.value ?? 'Melayani Dengan Sepenuh Hati'}
    />
  )
}