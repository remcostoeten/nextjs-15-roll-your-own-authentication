export type RateLimitOptions = {
	interval: number // Time window in seconds
	maxRequests: number // Maximum number of requests allowed in the interval
}

// Default rate limits for different routes and actions
export const RATE_LIMITS = {
	default: { interval: 60, maxRequests: 60 }, // 60 requests per minute
	auth: { interval: 300, maxRequests: 20 }, // 20 requests per 5 minutes
	userActions: { interval: 3600, maxRequests: 100 }, // 100 requests per hour
	sessions: {
		create: { interval: 300, maxRequests: 5 }, // 5 new sessions per 5 minutes
		get: { interval: 60, maxRequests: 30 }, // 30 session checks per minute
		delete: { interval: 300, maxRequests: 10 } // 10 session deletions per 5 minutes
	},
	passwordReset: { interval: 3600, maxRequests: 3 }, // 3 password resets per hour
	emailVerification: { interval: 3600, maxRequests: 5 } // 5 verification emails per hour
} as const

export class RateLimitError extends Error {
	constructor(
		public readonly remaining: number = 0,
		public readonly reset: number,
		message: string = 'Too many requests'
	) {
		super(message)
		this.name = 'RateLimitError'
	}
}
