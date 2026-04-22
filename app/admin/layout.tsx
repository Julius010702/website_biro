// app/admin/layout.tsx
import { redirect }     from 'next/navigation'
import { getSession }   from '@/lib/auth'
import AdminSidebar     from '@/components/(admin)/AdminSidebar'
import AdminHeader      from '@/components/(admin)/AdminHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Admin | Biro Organisasi NTT',
    default:  'Admin | Biro Organisasi NTT',
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#F4F7FD' }}
    >
      {/* ── Sidebar ── */}
      <AdminSidebar />

      {/* ── Main column ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Header */}
        <AdminHeader user={session} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}