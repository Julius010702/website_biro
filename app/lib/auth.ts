// src/lib/auth.ts
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { cache } from 'react'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'biro-organisasi-ntt-secret-change-in-production'
)

export type SessionUser = {
  id:    string
  name:  string
  email: string
  role:  'SUPERADMIN' | 'ADMIN' | 'EDITOR'
}

/**
 * Returns the current session user from the JWT cookie,
 * or null if unauthenticated / token invalid.
 * Wrapped in React `cache()` so it runs at most once per request.
 */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
})

/**
 * Convenience: throw a redirect-friendly error when not logged in.
 */
export async function requireSession(): Promise<SessionUser> {
  const user = await getSession()
  if (!user) throw new Error('UNAUTHENTICATED')
  return user
}

/**
 * Alias untuk kompatibilitas dengan app/admin/layout.tsx
 */
export const auth = getSession