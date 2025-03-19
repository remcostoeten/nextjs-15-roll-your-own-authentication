import { SignJWT, jwtVerify } from 'jose'
import { env } from 'env'

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)

export type JWTPayload = {
	sub: string
	email: string
	role: 'admin' | 'user'
	iat: number
	exp: number
}

export async function generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
	const iat = Math.floor(Date.now() / 1000)

	const accessToken = await new SignJWT({ ...payload })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt(iat)
		.setExpirationTime(iat + 15 * 60) // 15 minutes
		.sign(JWT_SECRET)

	const refreshToken = await new SignJWT({ ...payload })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt(iat)
		.setExpirationTime(iat + 7 * 24 * 60 * 60) // 7 days
		.sign(JWT_SECRET)

	return { accessToken, refreshToken }
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET)
		return payload as JWTPayload
	} catch (error) {
		console.error('Token verification error:', error)
		return null
	}
}
