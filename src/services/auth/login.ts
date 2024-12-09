import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { db } from '../../server/db/drizzle'
import { sessions, users } from '../../server/db/schema'
import { checkRateLimit } from './rate-limiter'

const SECRET_KEY = process.env.JWT_SECRET_KEY!
const key = new TextEncoder().encode(SECRET_KEY)

export async function loginUser(email: string, password: string) {
	if (!(await checkRateLimit())) {
		throw new Error('Too many login attempts. Please try again later.')
	}

	const [user] = await db.select().from(users).where(eq(users.email, email))

	if (!user) {
		throw new Error('User not found')
	}

	const passwordMatch = await bcryptjs.compare(password, user.password)

	if (!passwordMatch) {
		throw new Error('Invalid password')
	}

	const token = await new SignJWT({ userId: user.id, role: user.role })
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('1h')
		.sign(key)

	const oneHour = 60 * 60 * 1000
	const expiresAt = new Date(Date.now() + oneHour)

	await db.insert(sessions).values({
		userId: user.id,
		token,
		expiresAt
	})
	;(await cookies()).set('auth_token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production'
	})

	return user
}
