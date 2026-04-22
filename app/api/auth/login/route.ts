// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'biro-organisasi-ntt-secret-change-in-production'
)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan kata sandi wajib diisi.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        { message: 'Email atau kata sandi salah.' },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return NextResponse.json(
        { message: 'Email atau kata sandi salah.' },
        { status: 401 }
      )
    }

    // Create JWT (expires in 8 hours – one working day)
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

    // Set secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   60 * 60 * 8, // 8 hours
    })

    return NextResponse.json({
      message: 'Login berhasil.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server. Coba lagi.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}