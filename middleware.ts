import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/kontak',
  '/api/ppid/permohonan',
  '/api/uploadthing',
  '/api/upload',
  '/_next',
  '/images',
  '/favicon.ico',
  '/bacground_login.png',
  '/images/logo-prov-ntt.png',
]

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Hanya proteksi route /admin dan /api/admin
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  if (!isAdminRoute) return NextResponse.next()
  if (isPublic(pathname)) return NextResponse.next()

  const token = req.cookies.get('admin_token')?.value

  if (!token) {
    // Redirect ke login untuk halaman admin
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Return 401 untuk API admin
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    // Token invalid atau expired
    const response = pathname.startsWith('/admin')
      ? NextResponse.redirect(new URL('/login', req.url))
      : NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    response.cookies.delete('admin_token')
    return response
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}