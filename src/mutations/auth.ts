'use server'

import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { getUser as getUserService } from '../services/auth/get-user'
import { loginUser } from '../services/auth/login'
import { logoutUser } from '../services/auth/logout'
import { registerUser } from '../services/auth/register'

export async function register(email: string, password: string) {
	try {
		await registerUser(email, password)
		return { success: true }
	} catch (error) {
		console.error('Registration error:', error)
		return { success: false, error: 'Registration failed' }
	}
}

export async function login(email: string, password: string) {
	try {
		await loginUser(email, password)
		return { success: true }
	} catch (error) {
		console.error('Login error:', error)
		return { success: false, error: 'Login failed' }
	}
}

export async function logout() {
	try {
		await logoutUser()
		return { success: true }
	} catch (error) {
		console.error('Logout error:', error)
		return { success: false, error: 'Logout failed' }
	}
}

export async function getUser() {
	return await getUserService()
}

export async function changePasswordMutation(formData: FormData) {
	try {
		const user = await getUser()
		if (!user) {
			return { error: 'Unauthorized' }
		}

		const currentPassword = formData.get('currentPassword') as string
		const newPassword = formData.get('newPassword') as string

		const userWithPassword = await db.query.users.findFirst({
			where: eq(users.id, user.id),
			columns: {
				id: true,
				email: true,
				password: true,
				createdAt: true
			}
		})

		if (!userWithPassword || !userWithPassword.password) {
			return { error: 'User not found' }
		}

		const isValid = await bcryptjs.compare(
			currentPassword,
			userWithPassword.password
		)

		if (!isValid) {
			return { error: 'Current password is incorrect' }
		}

		const hashedPassword = await bcryptjs.hash(newPassword, 10)

		await db
			.update(users)
			.set({ password: hashedPassword })
			.where(eq(users.id, user.id))

		return { success: true }
	} catch (error) {
		console.error('Password change error:', error)
		return { error: 'Failed to change password' }
	}
}
