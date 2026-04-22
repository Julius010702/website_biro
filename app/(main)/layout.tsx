import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'

export default function MainLayout({
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
          paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}