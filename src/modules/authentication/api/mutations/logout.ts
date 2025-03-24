'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/server/db'
import { sessions } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'

export async function runtime() {
	return 'edge'
}

export async function logoutMutation() {
	console.log('Server: Starting logout mutation')

	try {
		// Get the cookie store
		const cookieStore = cookies()
		const refreshToken = cookieStore.get('refresh_token')

		console.log('Server: Got refresh token:', !!refreshToken?.value)

		// Clear the session from database if refresh token exists
		if (refreshToken?.value) {
			try {
				await db.delete(sessions).where(eq(sessions.refreshToken, refreshToken.value))
				console.log('Server: Deleted session from database')
			} catch (error) {
				console.error('Server: Error deleting session:', error)
				// Continue with logout even if session deletion fails
			}
		}

		// Clear all auth cookies
		const cookieOptions = {
			expires: new Date(0),
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
			sameSite: 'lax' as const,
		}

		// Set cookies to expire
		cookieStore.set('access_token', '', cookieOptions)
		cookieStore.set('refresh_token', '', cookieOptions)
		cookieStore.set('session', '', cookieOptions)

		console.log('Server: Cleared all cookies')

		// Revalidate the layout to update the auth state
		revalidatePath('/', 'layout')

		console.log('Server: Revalidated paths')

		return { success: true, message: 'Logged out successfully' }
	} catch (error) {
		console.error('Server: Logout error:', error)
		throw error
	}
}
