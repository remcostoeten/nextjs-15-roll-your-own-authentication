import { users } from '@/db/schema'
import { db } from '@/lib/db'
import { env } from '@/lib/env'
import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { Role, User } from '../types'

export async function createUser(data: {
	email: string
	password: string
}): Promise<User> {
	const hashedPassword = await hash(data.password, 12)

	const role: Role = data.email === env.ADMIN_EMAIL ? 'admin' : 'user'

	const [user] = await db
		.insert(users)
		.values({
			email: data.email.toLowerCase(),
			password: hashedPassword,
			role
		})
		.returning()

	return user
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, email.toLowerCase()))
		.limit(1)

	return user
}
