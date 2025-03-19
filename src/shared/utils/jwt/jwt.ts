import { SignJWT, jwtVerify } from 'jose'
import { randomUUID } from 'crypto'
import { env } from '@/env'

export interface TokenPayload {
	sub: string
	role?: string
	email?: string
}

export interface Tokens {
	accessToken: string
	refreshToken: string
}

/**
 * Verify an access token and return the payload
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload> {
	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(env.JWT_SECRET)
		)
		return payload as TokenPayload
	} catch {
		throw new Error('Invalid access token')
	}
}

/**
 * Verify a refresh token and return the payload
 */
export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(env.JWT_REFRESH_SECRET)
		)
		return payload as TokenPayload
	} catch {
		throw new Error('Invalid refresh token')
	}
}

/**
 * Sign a JWT access token
 */
export async function signAccessToken(payload: TokenPayload): Promise<string> {
	const secret = new TextEncoder().encode(env.JWT_SECRET)
	const expiresIn = env.ACCESS_TOKEN_EXPIRES_IN

	const token = await new SignJWT({ ...payload })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(expiresIn)
		.setJti(randomUUID())
		.sign(secret)

	return token
}

/**
 * Sign a JWT refresh token
 */
export async function signRefreshToken(payload: TokenPayload): Promise<string> {
	const secret = new TextEncoder().encode(env.JWT_REFRESH_SECRET)
	const expiresIn = env.REFRESH_TOKEN_EXPIRES_IN

	const token = await new SignJWT({ ...payload })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(expiresIn)
		.setJti(randomUUID())
		.sign(secret)

	return token
}

/**
 * Generate both access and refresh tokens
 */
export async function generateTokens(payload: TokenPayload): Promise<Tokens> {
	const accessToken = await signAccessToken(payload)
	const refreshToken = await signRefreshToken(payload)

	return {
		accessToken,
		refreshToken,
	}
}
