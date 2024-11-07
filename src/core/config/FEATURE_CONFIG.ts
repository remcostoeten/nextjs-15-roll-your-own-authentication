// Remove 'use client' directive from this file

type SessionIndicatorConfig = {
	ADMIN_ONLY: boolean
	USER_ONLY: boolean
	ALWAYS_SHOW: boolean
	enabled?: boolean
}

type PasswordValidationConfig = {
	enabled: boolean
	minLength: number
	requireSpecialChar: boolean
	requireNumber: boolean
	requireUppercase: boolean
}

type BaseConfig = {
	showToasts: boolean
	showSessionIndicator: SessionIndicatorConfig
	passwordValidation: PasswordValidationConfig
}

export type FeatureConfig = BaseConfig & {
	showSessionIndicator: SessionIndicatorConfig & { enabled: boolean }
	analytics: {
		enabled: boolean
		trackLocalhost: boolean
		trackBots: boolean
	}
}

export const BASE_CONFIG: BaseConfig = {
	showToasts: true,
	showSessionIndicator: {
		ADMIN_ONLY: false,
		USER_ONLY: false,
		ALWAYS_SHOW: true
	},
	passwordValidation: {
		enabled: true,
		minLength: 8,
		requireSpecialChar: true,
		requireNumber: true,
		requireUppercase: true
	}
} as const

// Merge BASE_CONFIG with analytics settings
export const DEFAULT_CONFIG: FeatureConfig = {
	...BASE_CONFIG,
	showSessionIndicator: {
		...BASE_CONFIG.showSessionIndicator,
		enabled: true
	},
	analytics: {
		enabled: true,
		trackLocalhost: true, // Enabled for development
		trackBots: false
	}
}

export function getFeatureConfig(role?: string): FeatureConfig {
	return {
		...BASE_CONFIG,
		showSessionIndicator: {
			...BASE_CONFIG.showSessionIndicator,
			enabled:
				BASE_CONFIG.showSessionIndicator.ALWAYS_SHOW ||
				(role === 'admin' &&
					BASE_CONFIG.showSessionIndicator.ADMIN_ONLY) ||
				(role !== 'admin' && BASE_CONFIG.showSessionIndicator.USER_ONLY)
		},
		analytics: {
			...DEFAULT_CONFIG.analytics,
			trackLocalhost: true, // Enabled for development
			trackBots: false
		}
	}
}
