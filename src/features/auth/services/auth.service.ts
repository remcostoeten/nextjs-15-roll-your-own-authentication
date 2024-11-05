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
		return this.storageService.saveUser({
			email,
			password: hashedPassword,
			role: 'user'
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
}
