// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, EMAIL_FROM } from '@/lib/resend'
import bcrypt from 'bcryptjs'

const requestLimiter = new Map<string, { count: number; resetAt: number }>()
const MAX_REQUESTS = 3
const WINDOW_MS = 15 * 60 * 1000 // 15 menit

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const record = requestLimiter.get(key)
  if (!record || now > record.resetAt) {
    requestLimiter.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (record.count >= MAX_REQUESTS) return false
  record.count++
  return true
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email wajib diisi.' }, { status: 400 })
    }

    const ip = getClientIp(req)
    const normalizedEmail = email.toLowerCase().trim()

    // Rate limit per-IP DAN per-email, supaya tidak spam ke satu alamat
    if (!checkRateLimit(`ip:${ip}`) || !checkRateLimit(`email:${normalizedEmail}`)) {
      return NextResponse.json(
        { message: 'Terlalu banyak permintaan. Coba lagi dalam beberapa menit.' },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    // Selalu balas sukses walau user tidak ditemukan, supaya tidak bisa dipakai
    // untuk mengecek email mana saja yang terdaftar (user enumeration).
    const genericResponse = NextResponse.json({
      message: 'Jika email terdaftar, kode OTP telah dikirim.',
    })

    if (!user) return genericResponse

    const otp = generateOtp()
    const otpHash = await bcrypt.hash(otp, 10)
    const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 menit

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOtpHash: otpHash,
        resetOtpExpiry: expiry,
        resetAttempts: 0,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject: 'Kode OTP Reset Password - Panel Admin Biro Organisasi',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #0A2342;">Reset Kata Sandi</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Halo ${user.name},<br/><br/>
              Kami menerima permintaan reset password untuk akun Panel Admin Biro Organisasi Setda Provinsi NTT.
              Gunakan kode OTP berikut untuk melanjutkan:
            </p>
            <div style="background: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0D47A1;">${otp}</span>
            </div>
            <p style="color: #64748B; font-size: 12px; line-height: 1.6;">
              Kode ini berlaku selama <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapa pun,
              termasuk pihak yang mengaku sebagai admin/IT.<br/><br/>
              Jika Anda tidak meminta reset password, abaikan email ini.
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[FORGOT-PASSWORD] Gagal kirim email:', emailErr)
      return NextResponse.json({ message: 'Gagal mengirim email. Coba lagi nanti.' }, { status: 500 })
    }

    return genericResponse
  } catch (err) {
    console.error('[FORGOT-PASSWORD ERROR]', err)
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}