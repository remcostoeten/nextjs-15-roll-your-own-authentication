'use client'

import type { SessionUser } from '../types'

export async function validateClientSession(): Promise<SessionUser | null> {
	try {
		const response = await fetch('/api/auth/validate-session', {
			method: 'GET',
			credentials: 'include'
		})

		if (!response.ok) return null
		const data = await response.json()
		return data.user
	} catch (error) {
		console.error('Client session validation error:', error)
		return null
	}
}

export async function clearClientSession(): Promise<void> {
	try {
		await fetch('/api/auth/clear-session', {
			method: 'POST',
			credentials: 'include'
		})
	} catch (error) {
		console.error('Clear session error:', error)
	}
}
