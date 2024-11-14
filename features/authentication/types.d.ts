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
	profile?: any 
}

export type ActivityStatus = 'success' | 'error' | 'pending'

export type ActivityLogType = 'login' | 'logout' | 'password_change' | 'email_change' | 'two_factor_enabled' | 'two_factor_disabled' | 'account_created' | 'failed_login'

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

export type SecurityEventType = 
    | 'login'
    | 'logout'
    | 'password_change'
    | 'email_change'
    | 'two_factor_enabled'
    | 'two_factor_disabled'
    | 'account_created'
    | 'failed_login'

export type SecurityEvent = {
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

export type UserProfile = {
    id: number
    email: string | null
    name: string | null
    role: 'user' | 'admin'
    createdAt: Date | null
    bio?: string | null
    phoneNumber?: string | null
    location?: string | null
    website?: string | null
    avatarUrl?: string | null

    emailVerified: boolean
    securityScore: number
    lastLoginAttempt: Date | null

    lastLocation: UserLocation | null
    lastDevice: DeviceInfo | null
    recentActivity: SecurityEvent[]
    loginStreak: number
    totalLogins: number
    failedLoginAttempts: number

    devices: DeviceInfo[]
    trustedLocations: UserLocation[]
}
