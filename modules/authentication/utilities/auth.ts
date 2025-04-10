import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { redirect } from 'next/navigation'

export type TokenPayload = {
	id: string
	email: string
	firstName: string
	lastName: string
	isAdmin: boolean
	sessionId: string
}

export async function generateToken(payload: TokenPayload): Promise<string> {
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET)

		if (!secret || secret.length === 0) {
			throw new Error('JWT_SECRET is not defined')
		}

		return await new SignJWT(payload as any)
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('7d')
			.sign(secret)
	} catch (error) {
		console.error('Error generating token:', error)
		throw new Error('Failed to generate token')
	}
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET)

		if (!secret || secret.length === 0) {
			return null
		}

		const { payload } = await jwtVerify(token, secret)
		return payload as TokenPayload
	} catch (error) {
		return null
	}
}

export async function getCurrentUser() {
	const token = (await cookies()).get('token')?.value

	if (!token) {
		return null
	}

	return await verifyToken(token)
}

export async function requireAuth() {
	const user = await getCurrentUser()

	if (!user) {
		redirect('/login')
	}

	return user
}

export async function requireAdmin() {
	const user = await getCurrentUser()

	if (!user || !user.isAdmin) {
		redirect('/dashboard')
	}

	return user
}

export async function logUserActivity(userId: string, action: string) {
	console.log(
		`User activity: ${userId} - ${action} at ${new Date().toISOString()}`
	)
	return true
}

export async function isFirstUser() {
	try {
		const users = await db.query.users.findMany({
			limit: 1,
		})
		return users.length === 0
	} catch (error) {
		return false
	}
}
