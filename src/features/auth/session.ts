'use server'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { type SessionUser } from './types'

const key = new TextEncoder().encode(process.env.JWT_SECRET)
const alg = 'HS256'

export async function setSession(
	userId: string,
	email: string,
	role: string
): Promise<void> {
	const token = await new SignJWT({ userId, email, role })
		.setProtectedHeader({ alg })
		.setExpirationTime('1d')
		.sign(key)

	;(await cookies()).set('session', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 86400
	})
}

export async function getSession(): Promise<SessionUser | null> {
	try {
		const token = (await cookies()).get('session')?.value

		if (!token) return null

		const verified = await jwtVerify(token, key)
		return verified.payload as SessionUser
	} catch {
		return null
	}
}

export async function verifySessionToken(
	token: string
): Promise<SessionUser | null> {
	try {
		const verified = await jwtVerify(token, key)
		return verified.payload as SessionUser
	} catch {
		return null
	}
}

export async function clearSession(): Promise<void> {
	;(await cookies()).delete('session')
}
