// app/(public)/profil/bagian/[slug]/BagianSidebarLink.tsx
'use client'

import Link from 'next/link'

type Props = {
  href: string
  nama: string
}

export default function BagianSidebarLink({ href, nama }: Props) {
  return (
    <Link
      href={href}
      className="block text-sm px-3 py-2.5 rounded-xl transition-colors hover:text-white"
      style={{ color: 'var(--color-ntt-dark)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-ntt-red-700)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
    >
      {nama}
    </Link>
  )
}