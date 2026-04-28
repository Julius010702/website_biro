// app/(main)/layout.tsx
import Header          from '@/components/layout/Header'
import Footer          from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import ScrollAnimator  from '@/components/shared/ScrollAnimator'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      {/* Scroll reveal animator — aktifkan animasi .reveal saat elemen masuk viewport */}
      <ScrollAnimator />
    </div>
  )
}