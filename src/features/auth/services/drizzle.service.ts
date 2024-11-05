import { User, users } from '@/db/schema'
import { createClient } from '@libsql/client'
import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import { StorageService } from '../types'
export class DrizzleStorageService implements StorageService {
	private db

	constructor() {
		const client = createClient({
			url: process.env.TURSO_DATABASE_URL!,
			authToken: process.env.TURSO_AUTH_TOKEN!
		})
		this.db = drizzle(client)
	}

	async saveUser(userData: {
		email: string
		password: string
	}): Promise<User> {
		const hashedPassword = await hash(userData.password, 10)

		const [user] = await this.db
			.insert(users)
			.values({
				email: userData.email,
				password: hashedPassword
			})
			.returning()

		return user
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const [user] = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1)

		return user || null
	}

	async findUserById(id: string): Promise<User | null> {
		const [user] = await this.db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1)

		return user || null
	}
}