'use server'

import { cookies } from 'next/headers'
import { createJwt, verifyJwt } from '@/modules/auth/lib/security'
import type { Role } from '@/modules/auth/api/schemas/user-schema'

const AUTH_COOKIE_NAME = 'auth_token'

export type AuthCookieUser = {
  id: number
  email: string
  username: string
  role: Role
}

export async function setAuthCookie(user: AuthCookieUser) {
  const token = await createJwt({
    sub: user.id.toString(),
    email: user.email,
    username: user.username,
    role: user.role,
  })

  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  })
}

export async function getAuthCookie() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(AUTH_COOKIE_NAME)
  if (!cookie?.value) return null

  try {
    const payload = await verifyJwt(cookie.value)
    return payload
  } catch (error) {
    console.error('Failed to verify auth cookie:', error)
    return null
  }
}

export async function deleteAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
} 