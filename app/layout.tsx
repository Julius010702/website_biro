import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Biro Organisasi Setda NTT',
    default: 'Biro Organisasi Setda NTT',
  },
  description: 'Website resmi Biro Organisasi Sekretariat Daerah Provinsi Nusa Tenggara Timur',
  keywords: ['Biro Organisasi', 'NTT', 'Nusa Tenggara Timur', 'Pemerintah Provinsi'],
  authors: [{ name: 'Biro Organisasi Prov. NTT' }],
  icons: {
    icon: '/logo-ntt.ico',
    shortcut: '/logo-ntt.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Biro Organisasi Setda NTT',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" style={{ overflowX: 'hidden', maxWidth: '100%' }}>
      <body style={{ overflowX: 'hidden', maxWidth: '100%', width: '100%' }}>
        {children}
      </body>
    </html>
  )
}