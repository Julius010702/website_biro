// components/sections/HeroSection.tsx
// Server Component — fetch data, render HeroSlider (client)
import { prisma } from '@/lib/prisma'
import HeroSlider from './HeroSlider'

export default async function HeroSection() {
  const [stats, settings] = await Promise.all([
    prisma.statistikBeranda.findMany({ orderBy: { urutan: 'asc' } }),
    prisma.siteSettings.findMany({
      where: { key: { in: ['site_tagline', 'site_description'] } },
    }),
  ])

  const tagline = settings.find((s) => s.key === 'site_tagline')?.value ?? 'Melayani Dengan Sepenuh Hati'

  return (
    <HeroSlider
      stats={stats.map((s) => ({
        id: s.id,
        nilai: s.nilai,
        label: s.label,
        ikon: s.ikon,
      }))}
      tagline={tagline}
    />
  )
}