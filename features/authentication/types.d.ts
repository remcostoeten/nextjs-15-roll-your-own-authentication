export type LoginResponse = {
	success: boolean
	error?: string
	remainingAttempts?: number
}

export type RegisterResponse = {
	success: boolean
	error?: string
	userId?: number
}

export type LogoutResponse = {
	success: boolean
	error?: string
}

export type ResetPasswordResponse = {
	success: boolean
	error?: string
}

export type VerifyEmailResponse = {
	success: boolean
	error?: string
}

export type UpdateProfileResponse = {
	success: boolean
	error?: string
	profile?: any // Replace 'any' with your profile type
}

export type ActivityLogType =
	| 'login'
	| 'login_failed'
	| 'account_created'
	| 'password_reset'
	| 'email_verified'
	| 'profile_updated'
	| 'logout'

export type ActivityStatus = 'success' | 'error' | 'pending'

export type UserRole = 'user' | 'admin'

export interface DeviceInfo {
	browser: string | null
	os: string | null
	isMobile: boolean
}

export interface LocationInfo {
	ip: string
	country?: string
	city?: string
}

export interface SessionInfo {
	userId: number
	token: string
	expiresAt: Date
	ipAddress: string
	userAgent: string | null
	deviceInfo: DeviceInfo
	lastLocation: LocationInfo
}

export type UserSession = {
	id: string
	deviceInfo: {
		browser: string | null
		os: string | null
		isMobile: boolean
	}
	lastActive: Date
	lastLocation?: {
		city?: string
		country?: string
	}
	token: string
}

export type UserData = {
	id: number
	email: string
	role: string
	emailVerified: boolean
	lastLoginAttempt: Date | null
	createdAt: Date
	passwordChangedAt: Date | null
	currentSessionToken: string | null
	lastLocation: {
		city?: string
		country?: string
	} | null
	lastDevice: {
		browser: string | null
		os: string | null
		isMobile: boolean
	} | null
	sessions: UserSession[]
	recentActivity: {
		type: string
		timestamp: Date
		details: {
			message?: string
			error?: string
			metadata?: Record<string, unknown>
		} | null
		status: string
	}[]
}
