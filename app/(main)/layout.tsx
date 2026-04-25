// app/(main)/layout.tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
      ⚠️ HAPUS overflow-x-hidden dari div wrapper ini.
      overflow: hidden pada ancestor APAPUN akan mematikan position: sticky.
      
      Cukup pakai w-full dan flex flex-col min-h-screen.
      Horizontal overflow dicegah di globals.css via overflow-x: clip
      pada html dan body (bukan di sini).
    */
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}