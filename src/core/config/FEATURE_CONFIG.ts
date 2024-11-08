// Remove 'use client' directive from this file

export const BASE_CONFIG = {
	passwordValidation: {
		minLength: 6,
		requireUppercase: true,
		requireLowercase: true,
		requireNumber: true
	}
}

export type FeatureConfig = {
	analytics: {
		enabled: boolean
		trackLocalhost: boolean
	}
	showSessionIndicator: {
		enabled: boolean
	}
	debugMode?: {
		enabled: boolean
	}
}

export function getFeatureConfig(role?: string): FeatureConfig {
	return {
		analytics: {
			enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
			trackLocalhost: process.env.NEXT_PUBLIC_ANALYTICS_TRACK_LOCALHOST === 'true'
		},
		showSessionIndicator: {
			enabled: process.env.NEXT_PUBLIC_SHOW_SESSION_INDICATOR === 'true'
		},
		debugMode: {
			enabled: process.env.NODE_ENV === 'development'
		}
	}
}
