/**
 * Calculates password strength based on various criteria
 * @param password - The password to evaluate
 * @returns number between 0-100 representing password strength
 */
export function calculatePasswordStrength(password: string): number {
	if (!password) return 0

	let strength = 0
	const criteria = {
		length:
			password.length >= 8 ? 25 : Math.round((password.length / 8) * 25),
		hasUppercase: /[A-Z]/.test(password) ? 25 : 0,
		hasLowercase: /[a-z]/.test(password) ? 15 : 0,
		hasNumbers: /\d/.test(password) ? 20 : 0,
		hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 15 : 0
	}

	strength = Object.values(criteria).reduce((acc, curr) => acc + curr, 0)

	// Cap at 100
	return Math.min(strength, 100)
}

/**
 * Utility functions for string manipulation
 */
export const utils = {
	/**
	 * Truncates a string to a specified length
	 */
	truncate: (str: string, length: number) => {
		if (str.length <= length) return str
		return str.slice(0, length) + '...'
	},

	/**
	 * Capitalizes the first letter of a string
	 */
	capitalize: (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
} as const

/**
 * Generates a secure random token for email verification
 * @returns string A random token
 */
export function generateToken(length: number = 32): string {
	return crypto.randomUUID()
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
