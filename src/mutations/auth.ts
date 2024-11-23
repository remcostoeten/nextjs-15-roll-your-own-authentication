'use server'

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
