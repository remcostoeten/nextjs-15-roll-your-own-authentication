import { env } from '@/env/server'
import { jwtVerify } from 'jose'
import { TextEncoder } from 'util'

export const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)

export const verifyJWT = async (token: string) => {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET)
		return payload
	} catch (error) {
		console.error('JWT verification failed:', error)
		return null
	}
}
