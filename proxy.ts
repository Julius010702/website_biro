// middleware.ts  (root of project, next to package.json)
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'biro-organisasi-ntt-secret-change-in-production'
)

// Routes that don't need authentication
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/lupa-password']

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only intercept /admin paths
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  // Allow public admin pages through
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = req.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  try {
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch {
    // Token invalid or expired – clear cookie and redirect
    const res = NextResponse.redirect(new URL('/admin/login', req.url))
    res.cookies.delete('admin_token')
    return res
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}