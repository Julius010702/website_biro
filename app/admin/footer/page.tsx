import type { Metadata } from 'next'
import FooterAdminPage from './_FooterPage'

export const metadata: Metadata = { title: 'Pengaturan Footer' }

export default function Page() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #E2EAF6' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-700" />
          <h1 className="text-xl font-bold" style={{ color: '#0A2342' }}>Pengaturan Footer</h1>
        </div>
        <p className="text-xs text-slate-500 ml-3">
          Kelola informasi kontak, sosial media, dan situs terkait yang tampil di footer website.
        </p>
      </div>
      <FooterAdminPage />
    </div>
  )
}
