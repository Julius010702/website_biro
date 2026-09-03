// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, resetToken, newPassword } = await req.json()

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json({ message: 'Data tidak lengkap.' }, { status: 400 })
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json({ message: 'Kata sandi baru minimal 6 karakter.' }, { status: 400 })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return NextResponse.json({ message: 'Sesi reset password tidak valid. Ulangi dari awal.' }, { status: 400 })
    }

    if (user.resetToken !== resetToken) {
      return NextResponse.json({ message: 'Sesi reset password tidak valid. Ulangi dari awal.' }, { status: 400 })
    }

    if (new Date() > user.resetTokenExpiry) {
      return NextResponse.json({ message: 'Sesi reset password sudah kedaluwarsa. Ulangi dari awal.' }, { status: 400 })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPasswordHash,
        resetOtpHash: null,
        resetOtpExpiry: null,
        resetAttempts: 0,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({ message: 'Kata sandi berhasil diubah. Silakan login dengan kata sandi baru.' })
  } catch (err) {
    console.error('[RESET-PASSWORD ERROR]', err)
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}