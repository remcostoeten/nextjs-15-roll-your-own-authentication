'use server'

import { env } from '@/lib/env'
import { SignJWT, jwtVerify } from 'jose'
import type { Role } from '../types'

type TokenPayload = {
	userId: string
	email: string
	role: Role
}

const secret = new TextEncoder().encode(env.JWT_SECRET)
const alg = 'HS256'

export async function generateToken(payload: TokenPayload): Promise<string> {
	const token = await new SignJWT({
		userId: payload.userId,
		email: payload.email,
		role: payload.role
	})
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setExpirationTime('24h')
		.sign(secret)

	return token
}

export async function verifyToken(token: string) {
	try {
		const verified = await jwtVerify(token, secret)
		return verified.payload as TokenPayload & { exp: number; iat: number }
	} catch {
		return null
	}
}
