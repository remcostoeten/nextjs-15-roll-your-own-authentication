// Duration constants in milliseconds

// Base unit
export const ONE_SECOND: number = 1000

// Time units grouped by magnitude
export const MINUTES = {
	ONE: ONE_SECOND * 60,
	FIVE: ONE_SECOND * 300,
	TEN: ONE_SECOND * 600,
	FIFTEEN: ONE_SECOND * 900,
	THIRTY: ONE_SECOND * 1800,
	SIXTY: ONE_SECOND * 3600
} as const

export const HOURS = {
	ONE: MINUTES.SIXTY,
	TWO: MINUTES.SIXTY * 2,
	THREE: MINUTES.SIXTY * 3,
	TWELVE: MINUTES.SIXTY * 12
} as const

export const DAYS = {
	ONE: HOURS.TWELVE * 2,
	TWO: HOURS.TWELVE * 4,
	THREE: HOURS.TWELVE * 6,
	FOUR: HOURS.TWELVE * 8
} as const

// Common web-specific durations
// export const REFRESH_INTERVAL: number = MINUTES.FIVE    // Common for polling
// export const DEFAULT_TIMEOUT: number = MINUTES.ONE / 2  // API timeout (30 seconds)
// export const SESSION_TIMEOUT: number = DAYS.ONE         // Session duration
// export const CACHE_DURATION: number = HOURS.ONE         // Cache TTL
// export const TOKEN_EXPIRY: number = HOURS.TWO          // JWT expiry

// Rate limiting durations
export const RATE_LIMIT_WINDOW: number = MINUTES.FIFTEEN
// export const RATE_LIMIT_RESET: number = HOURS.ONE

// // Animation durations (in milliseconds)
// export const ANIMATION_FAST: number = 200
// export const ANIMATION_NORMAL: number = 300
// export const ANIMATION_SLOW: number = 500
