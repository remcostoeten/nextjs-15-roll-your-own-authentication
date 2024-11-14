// Base response type for all auth operations
type BaseResponse = {
	success: boolean
	error?: string
}

// Auth operation responses
type LoginResponse = BaseResponse & {
	remainingAttempts?: number
	user?: UserProfile | null
	message?: string
	maxLoginAttempts?: number
}

type RegisterResponse = BaseResponse & {
	userId?: number
}

type LogoutResponse = BaseResponse

type ActivityLogType = 'login' | 'logout' | 'register' | SecurityEventType
type ActivityLogDetails = {
	message: string
	metadata?: Record<string, unknown>
}
type ActivityStatus = 'success' | 'error' | 'warning' | 'info'
type UserRole = 'user' | 'admin'

// Location and device tracking
type GeoCoordinates = {
	latitude?: number
	longitude?: number
}

type UserLocation = GeoCoordinates & {
	city: string
	country: string
	region?: string
	lastUpdated: Date
}

type DeviceInfo = {
	browser: string
	os: string
	device: string
	isMobile: boolean
	lastUsed: Date
}

// Security and activity monitoring
type SecurityEventType =
	| 'failed_login'
	| 'password_reset'
	| 'account_locked'
	| 'invalid_token'

type SecurityEvent = {
	type: SecurityEventType
	timestamp: Date
	details: {
		message: string
		location: UserLocation | null
		device: DeviceInfo | null
		success: boolean
	}
	status: ActivityStatus
	ipAddress: string | null
}

type UserBasicInfo = {
	id: number
	email: string | null
	name: string | null
	role: UserRole
	createdAt: Date | null
}

type UserOptionalInfo = {
	bio?: string | null
	phoneNumber?: string | null
	location?: string | null
	website?: string | null
	avatarUrl?: string | null
}

type UserSecurityInfo = {
	emailVerified: boolean
	securityScore: number
	lastLoginAttempt: Date | null
	loginStreak: number
	totalLogins: number
	failedLoginAttempts: number
}

type UserProfile = UserBasicInfo &
	UserOptionalInfo &
	UserSecurityInfo & {
		lastLocation: UserLocation | null
		lastDevice: DeviceInfo | null
		recentActivity: SecurityEvent[]
		devices: DeviceInfo[]
		trustedLocations: UserLocation[]
	}

// Minimal user info for UI components
type UserMenuInfo = Pick<UserProfile, 'email' | 'role' | 'avatarUrl'>

export type {
	ActivityLogDetails,
	ActivityLogType,
	ActivityStatus,
	BaseResponse,
	DeviceInfo,
	LoginResponse,
	LogoutResponse,
	RegisterResponse,
	SecurityEvent,
	SecurityEventType,
	UserLocation,
	UserMenuInfo,
	UserProfile,
	UserRole
}
