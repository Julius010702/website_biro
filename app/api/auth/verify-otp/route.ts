// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const MAX_ATTEMPTS = 5

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp || typeof otp !== 'string') {
      return NextResponse.json({ message: 'Email dan kode OTP wajib diisi.' }, { status: 400 })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (!user || !user.resetOtpHash || !user.resetOtpExpiry) {
      return NextResponse.json({ message: 'Kode OTP tidak valid atau sudah kedaluwarsa.' }, { status: 400 })
    }

    if (new Date() > user.resetOtpExpiry) {
      return NextResponse.json({ message: 'Kode OTP sudah kedaluwarsa. Minta kode baru.' }, { status: 400 })
    }

    if (user.resetAttempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { message: 'Terlalu banyak percobaan salah. Minta kode OTP baru.' },
        { status: 429 }
      )
    }

    const valid = await bcrypt.compare(otp, user.resetOtpHash)

    if (!valid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetAttempts: { increment: 1 } },
      })
      const sisaPercobaan = MAX_ATTEMPTS - (user.resetAttempts + 1)
      return NextResponse.json(
        { message: `Kode OTP salah. Sisa percobaan: ${Math.max(sisaPercobaan, 0)}.` },
        { status: 400 }
      )
    }

    // OTP benar -> keluarkan token reset sementara (15 menit), invalidasi OTP
    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOtpHash: null,
        resetOtpExpiry: null,
        resetAttempts: 0,
        resetToken,
        resetTokenExpiry: tokenExpiry,
      },
    })

    return NextResponse.json({ message: 'Kode OTP valid.', resetToken })
  } catch (err) {
    console.error('[VERIFY-OTP ERROR]', err)
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}