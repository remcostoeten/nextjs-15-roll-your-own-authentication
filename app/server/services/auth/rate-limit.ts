'use server'

import { getFeatureConfig } from '@/config/features.config'

interface RateLimitAttempt {
	attempts: number
	lastAttempt: number
	blockedUntil?: number
}

const rateLimitStore = new Map<string, RateLimitAttempt>()

// Get rate limit config
const getRateLimitConfig = () => {
	const securityConfig = getFeatureConfig('security')
	return securityConfig.rateLimiting
}

// Cleanup old entries periodically
setInterval(() => {
	const now = Date.now()
	const { windowMs } = getRateLimitConfig()

	for (const [key, value] of rateLimitStore.entries()) {
		if (
			(value.blockedUntil && value.blockedUntil < now) ||
			now - value.lastAttempt > windowMs
		) {
			rateLimitStore.delete(key)
		}
	}
}, getRateLimitConfig().windowMs)

export async function checkRateLimit(identifier: string): Promise<{
	blocked: boolean
	remainingAttempts: number
	blockedUntil?: Date
}> {
	const rateLimitConfig = getRateLimitConfig()
	if (!rateLimitConfig.enabled) {
		return { blocked: false, remainingAttempts: Infinity }
	}

	const now = Date.now()

	// Get or initialize attempt record
	const record = rateLimitStore.get(identifier) || {
		attempts: 0,
		lastAttempt: now
	}

	// Check if blocked
	if (record.blockedUntil && record.blockedUntil > now) {
		return {
			blocked: true,
			remainingAttempts: 0,
			blockedUntil: new Date(record.blockedUntil)
		}
	}

	// Reset attempts if window expired
	if (now - record.lastAttempt > rateLimitConfig.windowMs) {
		record.attempts = 0
		record.lastAttempt = now
		record.blockedUntil = undefined
	}

	// Check if should be blocked
	if (record.attempts >= rateLimitConfig.maxAttempts) {
		record.blockedUntil = now + rateLimitConfig.blockDuration
		rateLimitStore.set(identifier, record)

		return {
			blocked: true,
			remainingAttempts: 0,
			blockedUntil: new Date(record.blockedUntil)
		}
	}

	return {
		blocked: false,
		remainingAttempts: rateLimitConfig.maxAttempts - record.attempts
	}
}

export async function incrementLoginAttempts(
	identifier: string
): Promise<void> {
	const rateLimitConfig = getRateLimitConfig()
	if (!rateLimitConfig.enabled) return

	const record = rateLimitStore.get(identifier) || {
		attempts: 0,
		lastAttempt: Date.now()
	}

	record.attempts++
	record.lastAttempt = Date.now()
	rateLimitStore.set(identifier, record)
}

export async function resetLoginAttempts(identifier: string): Promise<void> {
	rateLimitStore.delete(identifier)
}
