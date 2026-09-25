// components/shared/KontakInfoCard.tsx
// Kartu info kontak di sidebar halaman profil — datanya sama dengan footer
// (tabel InformasiKontak, dikelola di Admin → Footer → Informasi Kontak).
import { prisma } from '@/lib/prisma'

const ikonEmoji: Record<string, string> = {
  MapPin: '📍',
  Clock:  '🕐',
  Phone:  '📞',
}

export default async function KontakInfoCard() {
  const kontakList = await prisma.informasiKontak.findMany({
    where:   { ikon: { in: Object.keys(ikonEmoji) } },
    orderBy: { urutan: 'asc' },
  })

  return (
    <div className="rounded-2xl p-4 reveal reveal-right reveal-delay-2"
      style={{ background: 'linear-gradient(135deg, #0A2342, #0D47A1)', border: '1px solid #0D47A1' }}>
      <p className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-2">Biro Organisasi</p>
      <p className="text-sm font-bold text-white leading-snug mb-3">Setda Provinsi Nusa Tenggara Timur</p>
      <div className="space-y-1.5">
        {kontakList.map((info) => (
          <div key={info.id} className="flex items-start gap-2">
            <span className="text-xs mt-0.5">{ikonEmoji[info.ikon ?? '']}</span>
            <p className="text-[11px] text-white/60 leading-snug">{info.nilai}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
