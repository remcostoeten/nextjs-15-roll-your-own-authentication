import { jwtVerify } from 'jose'
import { env } from 'env'
import { TokenPayload } from './types'

/**
 * Verify an access token and return the payload
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload> {
	try {
		const secret = new TextEncoder().encode(env.JWT_SECRET)
		const { payload } = await jwtVerify(token, secret)
		return payload as TokenPayload
	} catch (error) {
		throw new Error('Invalid access token')
	}
}

/**
 * Verify a refresh token and return the payload
 */
export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
	try {
		const secret = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET)
		const { payload } = await jwtVerify(token, secret)
		return payload as TokenPayload
	} catch (error) {
		throw new Error('Invalid refresh token')
	}
}
