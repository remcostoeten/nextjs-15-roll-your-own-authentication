import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from '../../server/db'
import { users } from '../../server/db/schema'

const SECRET_KEY = process.env.JWT_SECRET_KEY!
const key = new TextEncoder().encode(SECRET_KEY)

export async function getUser() {
	const token = (await cookies()).get('auth_token')?.value

	if (!token) {
		return null
	}

	try {
		const { payload } = await jwtVerify(token, key)
		const userId =
			typeof payload.userId === 'number'
				? payload.userId
				: Number(payload.userId)

		const [user] = await db
			.select({
				id: users.id,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt
			})
			.from(users)
			.where(eq(users.id, userId))

		if (!user) {
			return null
		}

		return user
	} catch (error) {
		console.error('Get user error:', error)
		return null
	}
}
