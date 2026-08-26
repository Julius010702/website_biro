// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

// Simple in-memory rate limiter
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 menit

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: WINDOW_MS }
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetIn: record.resetAt - now }
  }

  record.count++
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count, resetIn: record.resetAt - now }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rateLimit = checkRateLimit(ip)

  if (!rateLimit.allowed) {
    const minutes = Math.ceil(rateLimit.resetIn / 60000)
    return NextResponse.json(
      { message: `Terlalu banyak percobaan login. Coba lagi dalam ${minutes} menit.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
          'X-RateLimit-Limit': String(MAX_ATTEMPTS),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Email dan kata sandi wajib diisi.' }, { status: 400 })
    }

    // Validasi format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Format email tidak valid.' }, { status: 400 })
    }

    if (!process.env.JWT_SECRET) {
      console.error('[LOGIN] JWT_SECRET tidak dikonfigurasi!')
      return NextResponse.json({ message: 'Konfigurasi server bermasalah.' }, { status: 500 })
    }

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })

    // Selalu jalankan bcrypt untuk mencegah timing attack
    const dummyHash = '$2a$12$dummy.hash.to.prevent.timing.attacks.xxxxxxxxxxxxxxxxx'
    const valid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, dummyHash).then(() => false)

    if (!user || !valid) {
      return NextResponse.json({ message: 'Email atau kata sandi salah.' }, { status: 401 })
    }

    // Reset rate limit setelah berhasil login
    loginAttempts.delete(ip)

    const token = await new SignJWT({
      id:    user.id,
      email: user.email,
      name:  user.name,
      role:  user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET)

    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path:     '/',
      maxAge:   60 * 60 * 8,
    })

    return NextResponse.json({
      message: 'Login berhasil.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}