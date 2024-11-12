'use server'

import { cookies } from 'next/headers'
import type { SessionUser } from '../types'
import { verifyToken } from './jwt.service'

export async function validateServerSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')?.value
    if (!sessionCookie) return null

    const payload = await verifyToken(sessionCookie)
    if (!payload) return null

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

export async function clearServerSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.set('session', '', {
    expires: new Date(0),
    path: '/'
  })
}
