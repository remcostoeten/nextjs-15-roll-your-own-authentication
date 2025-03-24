'use client'

import { logoutMutation } from '../api/mutations/logout'
import { type User } from '@/modules/authentication/models/z.user'
import {
	registerMutation,
	type RegisterFormState,
} from '../api/mutations/register'

type RegisterResponse = RegisterFormState

export type AuthResponse = {
	user: User
	message?: string
}

/**
 * This hook provides functions for calling the authentication API endpoints
 */
export const useAuthApi = () => {
	/**
	 * Login a user
	 */
	const login = async (credentials: { email: string; password: string }) => {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.error || 'Failed to login')
		}

		const data = await response.json()

		// Store the JWT token in localStorage for devtools
		if (data.tokens?.accessToken) {
			localStorage.setItem('jwt_token', data.tokens.accessToken)
		}

		return data
	}

	/**
	 * Register a new user
	 */
	const register = async (userData: {
		email: string
		password: string
		firstName: string
		lastName: string
	}): Promise<RegisterResponse> => {
		try {
			// Basic validation before making the request
			const errors: string[] = []

			if (!userData.email?.trim()) {
				errors.push('Email is required')
			}
			if (!userData.password?.trim()) {
				errors.push('Password is required')
			}
			if (!userData.firstName?.trim()) {
				errors.push('First name is required')
			}
			if (!userData.lastName?.trim()) {
				errors.push('Last name is required')
			}

			// If there are any validation errors, throw the first one
			if (errors.length > 0) {
				throw new Error(errors[0])
			}

			// Trim whitespace from text fields
			const cleanedData = {
				...userData,
				email: userData.email.trim().toLowerCase(),
				firstName: userData.firstName.trim(),
				lastName: userData.lastName.trim(),
				password: userData.password.trim(),
			}

			// Call the server action with cleaned data
			const result = await registerMutation(cleanedData)
			if (!result.success) {
				throw new Error(result.message || 'Registration failed')
			}
			return result
		} catch (error) {
			console.error('Registration error:', error)
			throw error
		}
	}

	/**
	 * Logout the current user using server action
	 */
	const logout = async () => {
		console.log('Client: Starting logout process')
		try {
			const result = await logoutMutation()
			console.log('Client: Logout mutation completed:', result)

			// Remove JWT token from localStorage
			localStorage.removeItem('jwt_token')
			console.log('Client: Removed JWT from localStorage')

			// Clear any other client-side auth state
			localStorage.removeItem('user')
			sessionStorage.clear()
			console.log('Client: Cleared all client-side storage')

			return result
		} catch (error) {
			console.error('Client: Logout error:', error)
			throw error
		}
	}

	/**
	 * Refresh the authentication tokens
	 */
	const refreshAuth = async () => {
		const response = await fetch('/api/auth/refresh', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.error || 'Failed to refresh authentication'
			)
		}

		return response.json()
	}

	/**
	 * Get the current user
	 */
	const getUser = async (): Promise<User | null> => {
		try {
			const response = await fetch('/api/auth/user')
			if (!response.ok) {
				console.error('Failed to fetch user:', response.statusText)
				return null
			}
			const data = await response.json()
			console.log('API getUser response:', data) // Debug log
			return data.user
		} catch (error) {
			console.error('Error in getUser:', error)
			return null
		}
	}

	/**
	 * Verify the current token
	 */
	const verifyToken = async () => {
		try {
			const response = await fetch('/api/auth/verify')
			if (!response.ok) {
				console.error('Token verification failed:', response.statusText)
				return { isValid: false }
			}
			const data = await response.json()
			console.log('Token verification response:', data) // Debug log
			return { isValid: true, ...data }
		} catch (error) {
			console.error('Error verifying token:', error)
			return { isValid: false }
		}
	}

	return {
		login,
		register,
		logout,
		refreshAuth,
		getUser,
		verifyToken,
	}
}
