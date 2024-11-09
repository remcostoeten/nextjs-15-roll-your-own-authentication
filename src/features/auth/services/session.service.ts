/**
 * @author Remco Stoeten
 * @description Provides session management operations for the application.
 */

import { db } from '@/db'
import { sessions, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { cookies, headers } from 'next/headers'
import type { SessionUser } from '../types'
import { JWTService } from './jwt.service'

export class SessionService {
	private jwtService: JWTService

	constructor() {
		this.jwtService = new JWTService()
	}

	/**
	 * Creates a new session for a user.
	 * @param userId The user's ID.
	 * @param email The user's email.
	 * @param role The user's role.
	 * @returns The created session.
	 */
	async createSession(userId: string, email: string, role: string) {
		try {
			// Create JWT token
			const token = await this.jwtService.createToken({
				userId,
				email,
				role
			})
			const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

			// Get request metadata
			const headersList = await headers()
			const userAgent = headersList.get('user-agent')
			const ipAddress = headersList.get('x-forwarded-for') || 'unknown'

			// Create session in database
			const [session] = await db
				.insert(sessions)
				.values({
					userId,
					userAgent,
					ipAddress,
					expiresAt: expires.toISOString(),
					last_used: new Date().toISOString()
				})
				.returning()

			if (!session) {
				throw new Error('Failed to create session')
			}

			// Set session cookie
			;(
				await // Set session cookie
				cookies()
			).set('session', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				expires,
				path: '/'
			})

			return session
		} catch (error) {
			console.error('Create session error:', error)
			throw new Error('Failed to create session')
		}
	}

	/**
	 * Validates the current session.
	 * @returns The session user if valid, otherwise null.
	 */
	async validateSession(): Promise<SessionUser | null> {
		try {
			const sessionCookie = (await cookies()).get('session')
			if (!sessionCookie?.value) return null

			// Verify JWT token
			const payload = await this.jwtService.verifyToken<{
				userId: string
				email: string
				role: string
			}>(sessionCookie.value)

			if (!payload) return null

			// Check if user exists
			const user = await db
				.select()
				.from(users)
				.where(eq(users.id, payload.userId))
				.get()

			if (!user) {
				await this.clearSession()
				return null
			}

			// Check if session exists and is valid
			const session = await db
				.select()
				.from(sessions)
				.where(eq(sessions.userId, payload.userId))
				.get()

			if (!session || new Date(session.expiresAt) < new Date()) {
				await this.clearSession()
				return null
			}

			// Update last used timestamp
			await db
				.update(sessions)
				.set({ last_used: new Date().toISOString() })
				.where(eq(sessions.id, session.id))

			return {
				userId: payload.userId,
				email: payload.email,
				role: payload.role
			}
		} catch (error) {
			console.error('Validate session error:', error)
			return null
		}
	}

	/**
	 * Clears the current session.
	 */
	async clearSession() {
		try {
			const sessionCookie = (await cookies()).get('session')
			if (sessionCookie?.value) {
				const payload = await this.jwtService.verifyToken<{
					userId: string
				}>(sessionCookie.value)

				if (payload?.userId) {
					// Remove session from database
					await db
						.delete(sessions)
						.where(eq(sessions.userId, payload.userId))
				}
			}

			// Clear the cookie
			;(
				await // Clear the cookie
				cookies()
			).delete('session')
		} catch (error) {
			console.error('Clear session error:', error)
			// Still try to delete the cookie even if DB operation fails
			;(
				await // Still try to delete the cookie even if DB operation fails
				cookies()
			).delete('session')
		}
	}

	/**
	 * Retrieves all sessions for a given user.
	 * @param userId The user's ID.
	 * @returns An array of sessions.
	 */
	async getAllUserSessions(userId: string) {
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
	async clearAllUserSessions(userId: string) {
		try {
			await db.delete(sessions).where(eq(sessions.userId, userId))

			// Clear current session cookie if it belongs to this user
			const sessionCookie = (await cookies()).get('session')
			if (sessionCookie?.value) {
				const payload = await this.jwtService.verifyToken<{
					userId: string
				}>(sessionCookie.value)
				if (payload?.userId === userId) {
					;(await cookies()).delete('session')
				}
			}
		} catch (error) {
			console.error('Clear all user sessions error:', error)
			throw new Error('Failed to clear all sessions')
		}
	}

	/**
	 * Revokes a specific session.
	 * @param sessionId The session's ID.
	 */
	async revokeSession(sessionId: string) {
		try {
			await db.delete(sessions).where(eq(sessions.id, sessionId))
		} catch (error) {
			console.error('Revoke session error:', error)
			throw new Error('Failed to revoke session')
		}
	}
}
