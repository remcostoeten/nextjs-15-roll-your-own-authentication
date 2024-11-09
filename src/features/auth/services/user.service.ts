import { users } from '@/db/schema'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { User } from '../types'

export async function createUser(data: {
	email: string
	password: string
}): Promise<User> {
	const hashedPassword = await hash(data.password, 12)

	const [user] = await db
		.insert(users)
		.values({
			email: data.email,
			password: hashedPassword
		})
		.returning()

	return user
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1)

	return user
}
