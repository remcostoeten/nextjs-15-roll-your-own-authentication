import { db } from '@/server/db'
import { users, sessions } from '@/server/db/schemas'
import { userLoginSchema } from '@/modules/authentication/models'
import { verifyPassword } from '@/shared/utils/password'
import { generateTokens } from '@/shared/utils/jwt/jwt'
import { eq } from 'drizzle-orm'
import { updateLoginMetrics } from '@/modules/user-metrics/api'
import { logUserActivity } from '@/shared/utils/activity-logger'
import bcrypt from 'bcrypt'

export async function loginUser(
	credentials: unknown,
	requestInfo?: {
		userAgent?: string
		ipAddress?: string
	}
) {
	console.log(
		'[loginUser] Function called with credentials and requestInfo:',
		{ hasCredentials: !!credentials, hasRequestInfo: !!requestInfo }
	)

	// Store user information for activity logging
	let userId: string | undefined
	let loginFailed = false
	let failureReason = ''

	try {
		// Validate credentials
		const validatedData = userLoginSchema.parse(credentials)
		console.log('[loginUser] Credentials validated')

		// Find user by email
		const user = await db.query.users.findFirst({
			where: eq(users.email, validatedData.email),
		})

		if (!user) {
			console.log('[loginUser] User not found')
			loginFailed = true
			failureReason = 'user_not_found'
			throw new Error('Invalid email or password')
		}

		console.log('[loginUser] User found:', user.id)
		userId = user.id

		if (!user.passwordHash) {
			loginFailed = true;
			failureReason = 'invalid_password';
			throw new Error('Invalid email or password');
		}

		// Verify password
		const isPasswordValid = await verifyPassword(
			validatedData.password,
			user.passwordHash
		)

		if (!isPasswordValid) {
			console.log('[loginUser] Password validation failed')
			loginFailed = true
			failureReason = 'invalid_password'
			throw new Error('Invalid email or password')
		}

		console.log('[loginUser] Password validated successfully')

		// Generate tokens
		const tokens = await generateTokens({
			sub: user.id,
			email: user.email,
			role: typeof user.role === 'string' ? user.role : 'user',
		})
		console.log('[loginUser] Tokens generated')

		// Calculate expiration date for refresh token (7 days)
		const expiresAt = new Date()
		expiresAt.setDate(expiresAt.getDate() + 7)

		// Store refresh token in database
		await db.insert(sessions).values({
			userId: user.id,
			refreshToken: tokens.refreshToken,
			expiresAt,
			userAgent: requestInfo?.userAgent,
			ipAddress: requestInfo?.ipAddress,
		})
		console.log('[loginUser] Refresh token stored in database')

		// Update user metrics
		try {
			console.log('[loginUser] Updating user metrics...')
			const metricsResult = await updateLoginMetrics(user.id)
			console.log('[loginUser] User metrics updated:', metricsResult?.id)
		} catch (metricsError) {
			console.error('[loginUser] Error updating metrics:', metricsError)
			// Continue even if metrics update fails
		}

		// Log successful login activity using our new activity logger
		try {
			console.log('[loginUser] Logging activity...')
			await logUserActivity({
				userId: user.id,
				type: 'login_success',
				ip: requestInfo?.ipAddress,
				userAgent: requestInfo?.userAgent,
				metadata: {
					email: user.email,
					timestamp: new Date().toISOString(),
				},
			})
			console.log('[loginUser] Login activity logged successfully')
		} catch (activityError) {
			console.error('[loginUser] Error logging activity:', activityError)
			// Continue even if activity logging fails
		}

		// Return user data (excluding password) and tokens
		console.log(
			'[loginUser] Login successful, returning user data and tokens'
		)
		return {
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
			tokens,
		}
	} catch (error) {
		console.error('[loginUser] Login failed:', error)

		// Log failed login attempt if we have a user ID
		if (userId && loginFailed) {
			try {
				await logUserActivity({
					userId,
					type: 'login_failure',
					ip: requestInfo?.ipAddress,
					userAgent: requestInfo?.userAgent,
					metadata: {
						reason: failureReason,
						timestamp: new Date().toISOString(),
					},
				})
				console.log('[loginUser] Failed login activity logged')
			} catch (logError) {
				console.error(
					'[loginUser] Error logging failed login activity:',
					logError
				)
			}
		}

		throw error
	}
}
