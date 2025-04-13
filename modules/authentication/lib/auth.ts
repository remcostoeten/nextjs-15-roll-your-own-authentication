import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { eq } from 'drizzle-orm'
import { db } from '@/server/db'
import { users, notifications, userNotifications } from '@/server/db/schema'
import { createId } from '@paralleldrive/cuid2'

interface User {
	id: string
	email: string
	username: string
	firstName: string
	lastName: string
	password: string
	phone: string | null
	avatar: string | null
	role: string | null
	isAdmin: boolean
	createdAt: Date
	updatedAt: Date
}

export async function getCurrentUser(): Promise<User | null> {
	const token = (await cookies()).get('token')?.value

	if (!token) {
		return null
	}

	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET)
		const { payload } = await jwtVerify(token, secret)

		const user = await db.query.users.findFirst({
			where: eq(users.id, payload.id as string),
		})

		if (!user) {
			return null
		}

		return user
	} catch (error) {
		return null
	}
}

export async function requireAuth(): Promise<User> {
	const user = await getCurrentUser()
	if (!user) {
		throw new Error('Not authenticated')
	}
	return user
}

export async function logUserActivity(
	userId: string,
	action: string,
	details?: string
) {
	const notificationId = createId()
	const [notification] = await db
		.insert(notifications)
		.values({
			id: notificationId,
			title: action,
			content: details || '',
			type: 'info',
			createdById: userId,
			createdAt: new Date(),
			isGlobal: false,
		})
		.returning()

	const userNotificationId = createId()
	await db.insert(userNotifications).values({
		id: userNotificationId,
		userId,
		notificationId: notification.id,
		isRead: false,
		createdAt: new Date(),
	})
}
