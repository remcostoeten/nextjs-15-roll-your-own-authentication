'use server'

import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'

export type SessionUser = {
	userId: string
	email: string
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')

export async function getSession(): Promise<SessionUser | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get('session')?.value

	if (!token) return null

	try {
		const { payload } = await jwtVerify(token, secret)
		return payload as SessionUser
	} catch {
		return null
	}
}

export async function setSession(userId: string, email: string) {
	const token = await new SignJWT({ userId, email })
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('1d')
		.sign(secret)

	;(await cookies()).set('session', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 86400
	})
}

export async function clearSession() {
	;(await cookies()).delete('session')
}
