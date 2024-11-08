'use server'

import { compare, hash } from 'bcryptjs'
import type { AuthService, StorageService, User } from '../types'

export class UserAuthService implements AuthService {
	constructor(private storageService: StorageService) {}

	async createUser(email: string, password: string): Promise<User> {
		const existingUser = await this.storageService.findUserByEmail(email)
		if (existingUser) {
			throw new Error('User already exists')
		}

		const hashedPassword = await hash(password, 10)

		const normalizedEmail = email.toLowerCase().trim()
		const normalizedAdminEmail =
			process.env.ADMIN_EMAIL?.toLowerCase().trim() || ''

		console.log('Normalized user email:', normalizedEmail)
		console.log('Normalized admin email:', normalizedAdminEmail)

		const isAdmin = normalizedEmail === normalizedAdminEmail
		const role = isAdmin ? 'admin' : 'user'

		console.log('Assigned role:', role)

		return this.storageService.saveUser({
			email: normalizedEmail,
			password: hashedPassword,
			role
		})
	}

	async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.storageService.findUserByEmail(email)
		if (!user) return null

		const isValid = await compare(password, user.password)
		return isValid ? user : null
	}

	async getUserById(id: string): Promise<User | null> {
		return this.storageService.findUserById(id)
	}

	async isAdmin(userId: string): Promise<boolean> {
		const user = await this.storageService.findUserById(userId)
		return user?.role === 'admin'
	}
}
