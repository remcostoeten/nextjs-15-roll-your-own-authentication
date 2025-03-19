import { SignJWT } from 'jose'
import { env } from 'env'
import { FIFTEEN_MINUTES, WEEK } from '@/shared/helpers/date-helpers'

const encoder = new TextEncoder()

export type TokenPayload = {
	sub: string
	email?: string
}

export async function generateTokens(payload: TokenPayload) {
	const secret = encoder.encode(env.JWT_SECRET)
	const now = Math.floor(Date.now() / 1000)

	const accessToken = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt(now)
		.setExpirationTime(now + FIFTEEN_MINUTES)
		.sign(secret)

	const refreshToken = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt(now)
		.setExpirationTime(now + WEEK)
		.sign(secret)

	return { accessToken, refreshToken }
}
