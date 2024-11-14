import { MINUTES } from '@/constants'
import { env } from '@/env/server'
import {
	ActivityLogType,
	ActivityStatus
} from '@/features/authentication/types'
import { getFeatureConfig } from './features.config'

export const authConfig = {
	...getFeatureConfig('auth'),

	JWT: {
		ALGORITHM: 'HS256',
		SECRET: env.JWT_SECRET,
		EXPIRATION: '24h',
		REFRESH_THRESHOLD: MINUTES.THIRTY
	},

	COOKIE_OPTIONS: {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict' as const,
		path: '/',
		maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
	},

	RATE_LIMIT: {
		MAX_ATTEMPTS: 5,
		WINDOW_MS: MINUTES.FIFTEEN,
		BLOCK_DURATION: MINUTES.THIRTY
	},

	ACTIVITY_TYPES: {
		LOGIN: 'login' as ActivityLogType,
		LOGIN_FAILED: 'login_failed' as ActivityLogType,
		ACCOUNT_CREATED: 'account_created' as ActivityLogType,
		PASSWORD_RESET: 'password_reset' as ActivityLogType,
		EMAIL_VERIFIED: 'email_verified' as ActivityLogType,
		PROFILE_UPDATED: 'profile_updated' as ActivityLogType,
		LOGOUT: 'logout' as ActivityLogType
	} as const,

	STATUS: {
		SUCCESS: 'success' as ActivityStatus,
		ERROR: 'error' as ActivityStatus,
		PENDING: 'pending' as ActivityStatus
	} as const,

	MESSAGES: {
		// Authentication
		INVALID_CREDENTIALS: 'Invalid credentials',
		LOGIN_SUCCESS: 'Successful login',
		LOGIN_FAILED: 'Login failed',
		LOGOUT_SUCCESS: 'Successfully logged out',
		ACCOUNT_CREATED: 'Account successfully created',
		// Registration
		REGISTRATION_SUCCESS: 'Account successfully created',
		REGISTRATION_FAILED: 'Registration failed',
		EMAIL_TAKEN: 'Email already registered',

		// Password
		PASSWORD_RESET_SENT: 'Password reset instructions sent to your email',
		PASSWORD_RESET_SUCCESS: 'Password successfully reset',
		PASSWORD_RESET_FAILED: 'Password reset failed',
		PASSWORD_INVALID: 'Invalid password format',

		// Email
		EMAIL_VERIFICATION_SENT: 'Verification email sent',
		EMAIL_VERIFIED_SUCCESS: 'Email successfully verified',
		EMAIL_VERIFIED_FAILED: 'Email verification failed',

		// Profile
		PROFILE_UPDATE_SUCCESS: 'Profile successfully updated',
		PROFILE_UPDATE_FAILED: 'Profile update failed',

		// Errors
		RATE_LIMIT_EXCEEDED: 'Too many login attempts. Please try again later.',
		SESSION_EXPIRED: 'Your session has expired. Please log in again.',
		INVALID_TOKEN: 'Invalid or expired token',
		UNAUTHORIZED: 'Unauthorized access',
		SERVER_ERROR: 'An unexpected error occurred',
		FAILED_ATTEMPT: 'Failed login attempt - invalid password'
	} as const,

	VALIDATION: {
		PASSWORD_MIN_LENGTH: 8,
		PASSWORD_MAX_LENGTH: 100,
		NAME_MIN_LENGTH: 2,
		NAME_MAX_LENGTH: 50,
		USERNAME_MIN_LENGTH: 3,
		USERNAME_MAX_LENGTH: 30
	} as const
}

export type AuthConfig = typeof authConfig

export const {
	JWT,
	COOKIE_OPTIONS,
	RATE_LIMIT,
	ACTIVITY_TYPES,
	STATUS,
	MESSAGES,
	VALIDATION
} = authConfig
