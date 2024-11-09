/**
 * @author Remco Stoeten
 * @description Provides rate limiting operations for the application.
 */
type RateLimitRecord = {
	count: number
	resetTime: number
}

type RateLimitConfig = {
	windowMs: number
	maxRequests: number
}

type RateLimitResult = {
	success: boolean
	resetTime?: number
}

export class RateLimiterService {
	private store: Map<string, RateLimitRecord>
	private windowMs: number
	private maxRequests: number

	constructor(config: RateLimitConfig) {
		this.store = new Map()
		this.windowMs = config.windowMs
		this.maxRequests = config.maxRequests
	}

	/**
	 * Checks the rate limit for a given identifier.
	 *
	 * This method checks if the number of requests for the given identifier is within the limit.
	 *
	 * @param identifier The identifier for which to check the rate limit.
	 * @returns A promise that resolves to the rate limit result.
	 */
	async check(identifier: string): Promise<RateLimitResult> {
		const now = Date.now()
		const record = this.store.get(identifier)

		if (!record) {
			this.store.set(identifier, {
				count: 1,
				resetTime: now + this.windowMs
			})
			return { success: true }
		}

		if (now > record.resetTime) {
			this.store.set(identifier, {
				count: 1,
				resetTime: now + this.windowMs
			})
			return { success: true }
		}

		if (record.count >= this.maxRequests) {
			return {
				success: false,
				resetTime: record.resetTime
			}
		}

		record.count++
		this.store.set(identifier, record)
		return { success: true }
	}

	/**
	 * Cleans up the rate limit store.
	 *
	 * This method removes any records that have expired.
	 */
	cleanup(): void {
		const now = Date.now()
		for (const [key, record] of this.store.entries()) {
			if (now > record.resetTime) {
				this.store.delete(key)
			}
		}
	}

	/**
	 * Creates a rate limiter for authentication requests.
	 *
	 * This method returns a rate limiter with a window of 15 minutes and a maximum of 5 requests.
	 *
	 * @returns The rate limiter for authentication requests.
	 */
	static createAuthLimiter(): RateLimiterService {
		return new RateLimiterService({
			windowMs: 15 * 60 * 1000, // 15 minutes
			maxRequests: 5
		})
	}

	/**
	 * Creates a rate limiter for form submissions.
	 *
	 * This method returns a rate limiter with a window of 1 minute and a maximum of 10 requests.
	 *
	 * @returns The rate limiter for form submissions.
	 */
	static createFormLimiter(): RateLimiterService {
		return new RateLimiterService({
			windowMs: 60 * 1000, // 1 minute
			maxRequests: 10
		})
	}

	// Helper for server actions
	static async withRateLimit<T>(
		action: () => Promise<T>,
		identifier: string,
		limiter: RateLimiterService
	): Promise<T> {
		const result = await limiter.check(identifier)

		if (!result.success) {
			throw new Error(
				`Too many attempts. Please try again after ${new Date(
					result.resetTime!
				).toLocaleTimeString()}`
			)
		}

		return action()
	}
}

// Export instances for common use cases
export const authRateLimiter = RateLimiterService.createAuthLimiter()
export const formRateLimiter = RateLimiterService.createFormLimiter()
