// app/lib/resend.ts
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('[RESEND] RESEND_API_KEY tidak dikonfigurasi di .env')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const EMAIL_FROM = 'Biro Organisasi Setda NTT <onboarding@resend.dev>'