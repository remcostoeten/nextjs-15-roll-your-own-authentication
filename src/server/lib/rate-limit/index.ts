'use server'

import { RateLimitOptions, RateLimitError, RATE_LIMITS } from './types'

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; reset: number }>()

export async function rateLimit(
	key: string,
	options: RateLimitOptions = RATE_LIMITS.default
): Promise<{ success: boolean; remaining: number; reset: number }> {
	const now = Math.floor(Date.now() / 1000)

	// Clean up expired entries for this key pattern
	const keyPrefix = key.split(':')[0]
	for (const [existingKey, value] of rateLimitStore.entries()) {
		if (existingKey.startsWith(keyPrefix) && value.reset < now) {
			rateLimitStore.delete(existingKey)
		}
	}

	const windowKey = `${key}:${Math.floor(now / options.interval)}`

	// Get or create window
	const window = rateLimitStore.get(windowKey) || {
		count: 0,
		reset: now + options.interval
	}

	// Increment counter
	window.count++
	rateLimitStore.set(windowKey, window)

	const remaining = Math.max(0, options.maxRequests - window.count)
	const success = window.count <= options.maxRequests

	if (!success) {
		throw new RateLimitError(remaining, window.reset)
	}

	return {
		success,
		remaining,
		reset: window.reset
	}
}

export async function getRateLimit(
	pathname: string
): Promise<RateLimitOptions> {
	if (pathname.startsWith('/api/auth')) {
		return RATE_LIMITS.auth
	}
	if (pathname.startsWith('/api/user')) {
		return RATE_LIMITS.userActions
	}
	if (pathname.includes('password-reset')) {
		return RATE_LIMITS.passwordReset
	}
	if (pathname.includes('verify-email')) {
		return RATE_LIMITS.emailVerification
	}
	if (pathname.includes('session')) {
		const action = pathname.includes('create')
			? 'create'
			: pathname.includes('delete')
				? 'delete'
				: 'get'
		return RATE_LIMITS.sessions[action as keyof typeof RATE_LIMITS.sessions]
	}
	return RATE_LIMITS.default
}

export { RATE_LIMITS, type RateLimitOptions, RateLimitError }
