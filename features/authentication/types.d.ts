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

export type UserLocation = {
	city: string
	country: string
	region?: string
	latitude?: number
	longitude?: number
	lastUpdated: Date
}

export type DeviceInfo = {
	browser: string
	os: string
	device: string
	isMobile: boolean
	lastUsed: Date
}

export type SecurityEvent = {
	type:
		| 'login'
		| 'logout'
		| 'password_change'
		| 'email_change'
		| 'two_factor_enabled'
		| 'two_factor_disabled'
		| 'account_created'
		| 'failed_login'
	timestamp: Date
	details: {
		message: string
		location?: UserLocation
		device?: DeviceInfo
		success: boolean
	}
	ipAddress?: string
}

export type UserProfile = {
	id: number
	email: string
	name?: string
	role: 'user' | 'admin'
	createdAt: Date
	emailVerified: boolean
	twoFactorEnabled: boolean
	lastLoginAttempt: Date
	lastLocation: UserLocation
	lastDevice: DeviceInfo
	recentActivity: SecurityEvent[]
	securityScore: number
	loginStreak: number
	totalLogins: number
	failedLoginAttempts: number
	devices: DeviceInfo[]
	trustedLocations: UserLocation[]
	preferences: {
		emailNotifications: boolean
		loginAlerts: boolean
		timezone: string
		language: string
	}
}
