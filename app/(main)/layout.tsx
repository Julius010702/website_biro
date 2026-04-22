// app/(public)/layout.tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className="flex-1"
        style={{
          /* Dorong konten ke atas mobile nav (64px) hanya di layar < lg */
          paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </main>
      <Footer />
      {/* MobileBottomNav hanya muncul di < lg, sudah di-handle dengan lg:hidden di dalam komponen */}
      <MobileBottomNav />
    </div>
  )
}