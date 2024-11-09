// 'use server'

// import { db } from '@/db'
// import { sessions } from '@/db/schema'
// import { eq } from 'drizzle-orm'
// import { cookies, headers } from 'next/headers'
// import type { SessionUser } from '../types'
// import { createToken, verifyToken } from './jwt.service'

// /**
//  * Creates a new session for a user.
//  * @param userId The user's ID.
//  * @param email The user's email.
//  * @param role The user's role.
//  * @returns The created session.
//  */
// export async function createSession(userId: string, email: string, role: 'admin' | 'user') {
// 	try {
// 		// Create JWT token
// 		const token = await createToken({
// 			userId,
// 			email,
// 			role
// 		})
// 		const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

// 		// Get request metadata
// 		const headersList = await headers()
// 		const cookieStore = await cookies()
// 		const userAgent = headersList.get('user-agent')
// 		const ipAddress = headersList.get('x-forwarded-for') || 'unknown'

// 		// Create session in database
// 	const [session] = await db
//       .insert(sessions)
//       .values({
//         userId,
//         expiresAt: expires.toISOString(),
//         lastUsed: new Date().toISOString(),
//         userAgent: userAgent || null,
//         ipAddress: ipAddress || null
//       })
//       .returning()

//     if (!session) {
//       console.error('Session creation failed: No session returned from database')
//       throw new Error('Failed to create session')
//     }

// 		// Set session cookie immediately
// 		cookieStore.set({
// 			name: 'session',
// 			value: token,
// 			httpOnly: true,
// 			secure: process.env.NODE_ENV === 'production',
// 			sameSite: 'lax',
// 			expires,
// 			path: '/'
// 		})

// 		return session
// 	 } catch (error) {
//     console.error('Create session error:', error)
//     if (error instanceof Error) {
//       console.error('Error message:', error.message)
//       console.error('Error stack:', error.stack)
//     }
//     throw new Error('Failed to create session')
//   }
// }

// /**
//  * Validates the current session.
//  * @returns The session user if valid, otherwise null.
//  */

export async function validateSession(): Promise<SessionUser | null> {
	try {
		const cookieStore = await cookies()
		const sessionCookie = cookieStore.get('session')

		if (!sessionCookie?.value) {
			return null
		}

		const payload = await verifyToken<SessionUser>(sessionCookie.value)
		if (!payload?.userId || !payload?.email || !payload?.role) {
			return null
		}

		return payload
	} catch (error) {
		console.error('Session validation error:', error)
		return null
	}
}

// /**
//  * Clears the current session.
//  */
// export async function clearSession() {
// 	try {
// 		const cookieStore = await cookies()
// 		cookieStore.delete('session')
// 	} catch (error) {
// 		console.error('Clear session error:', error)
// 	}
// }

// /**
//  * Retrieves all sessions for a given user.
//  * @param userId The user's ID.
//  * @returns An array of sessions.
//  */
// export async function getAllUserSessions(userId: string) {
// 	try {
// 		return await db
// 			.select()
// 			.from(sessions)
// 			.where(eq(sessions.userId, userId))
// 	} catch (error) {
// 		console.error('Get user sessions error:', error)
// 		return []
// 	}
// }

// /**
//  * Clears all sessions for a given user.
//  * @param userId The user's ID.
//  */
// export async function clearAllUserSessions(userId: string) {
// 	try {
// 		await db.delete(sessions).where(eq(sessions.userId, userId))

// 		// Clear current session cookie if it belongs to this user
// 		const sessionCookie = (await cookies()).get('session')
// 		if (sessionCookie?.value) {
// 			const payload = await verifyToken<{
// 				userId: string
// 			}>(sessionCookie.value)
// 			if (payload?.userId === userId) {
// 				(await cookies()).delete('session')
// 			}
// 		}
// 	} catch (error) {
// 		console.error('Clear all user sessions error:', error)
// 		throw new Error('Failed to clear all sessions')
// 	}
// }

// /**
//  * Revokes a specific session.
//  * @param sessionId The session's ID.
//  */
// export async function revokeSession(sessionId: string) {
// 	try {
// 		await db.delete(sessions).where(eq(sessions.id, sessionId))
// 	} catch (error) {
// 		console.error('Revoke session error:', error)
// 		throw new Error('Failed to revoke session')
// 	}
// }
// src/features/auth/services/session.service.ts
import { db } from '@/db'
import { sessions } from '@/db/schema'
import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'
import { cookies, headers } from 'next/headers'
import { SessionUser } from '../types'
import { generateToken, verifyToken } from './jwt.service'

/**
 * Clears the session for the current user.
 */
export async function clearSession() {
	try {
		const cookieStore = await cookies()
		cookieStore.delete('session')
	} catch (error) {
		console.error('Clear session error:', error)
	}
}

/**
 * Retrieves all sessions for a given user.
 * @param userId The user's ID.
 * @returns An array of sessions.
 */
export async function getAllUserSessions(userId: string) {
	try {
		return await db
			.select()
			.from(sessions)
			.where(eq(sessions.userId, userId))
	} catch (error) {
		console.error('Get user sessions error:', error)
		return []
	}
}

/**
 * Clears all sessions for a given user.
 * @param userId The user's ID.
 */
export async function clearAllUserSessions(userId: string) {
	try {
		await db.delete().from(sessions).where(eq(sessions.userId, userId))
	} catch (error) {
		console.error('Clear all user sessions error:', error)
	}
}

export async function createToken(user: User): Promise<string> {
	return await generateToken(user)
}

export async function createSession(
	userId: string,
	email: string,
	role: 'admin' | 'user'
) {
	try {
		// Create session token
		const token = await createToken({
			userId,
			email,
			role
		})

		// Get request metadata
		const headersList = await headers()
		const userAgent = headersList.get('user-agent')
		const ipAddress = headersList.get('x-forwarded-for') || 'unknown'

		// Set session expiry
		const expiresAt = new Date()
		expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

		// Create session in database
		const [session] = await db
			.insert(sessions)
			.values({
				id: createId(),
				userId,
				expiresAt: expiresAt.toISOString(),
				userAgent,
				ipAddress
			})
			.returning()

		if (!session?.id) {
			throw new Error('Failed to create session')
		}

		// Set session cookie
		const cookieStore = await cookies()
		cookieStore.set('session', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			expires: expiresAt,
			path: '/'
		})

		return session
	} catch (error) {
		console.error('Create session error:', error)
		throw error
	}
}
