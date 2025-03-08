import { SignJWT } from 'jose'
import { randomUUID } from 'crypto'
import { env } from 'env'
import { TokenPayload } from './types'

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
	const secret = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET)
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
export async function generateTokens(payload: TokenPayload) {
	const accessToken = await signAccessToken(payload)
	const refreshToken = await signRefreshToken(payload)

	return {
		accessToken,
		refreshToken,
	}
}
