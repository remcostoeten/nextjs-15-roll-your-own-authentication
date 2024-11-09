'use server'

import { headers } from 'next/headers'

type RateLimitRecord = {
	count: number
	resetTime: number
}

type RateLimitConfig = {
	windowMs: number
	maxRequests: number
}

// Store rate limit records in memory
const rateLimitStore = new Map<string, RateLimitRecord>()

/**
 * Checks rate limit for a given identifier.
 */
export async function checkRateLimit(
	identifier: string,
	config: RateLimitConfig = {
		windowMs: 15 * 60 * 1000, // 15 minutes
		maxRequests: 5
	}
): Promise<{ success: boolean; resetTime?: number }> {
	const now = Date.now()
	const record = rateLimitStore.get(identifier)

	if (!record) {
		rateLimitStore.set(identifier, {
			count: 1,
			resetTime: now + config.windowMs
		})
		return { success: true }
	}

	if (now > record.resetTime) {
		rateLimitStore.set(identifier, {
			count: 1,
			resetTime: now + config.windowMs
		})
		return { success: true }
	}

	if (record.count >= config.maxRequests) {
		return {
			success: false,
			resetTime: record.resetTime
		}
	}

	record.count++
	rateLimitStore.set(identifier, record)
	return { success: true }
}

/**
 * Helper method to get rate limit identifier from request headers
 */
export async function getRateLimitIdentifier(action: string): Promise<string> {
	const headersList = await headers()
	const ip =
		headersList.get('cf-connecting-ip') ||
		headersList.get('x-forwarded-for') ||
		headersList.get('x-real-ip') ||
		'unknown'

	return `${action}:${ip}`
}

/**
 * Cleanup expired rate limit records
 */
export async function cleanupRateLimits(): Promise<void> {
	const now = Date.now()
	for (const [key, record] of rateLimitStore.entries()) {
		if (now > record.resetTime) {
			rateLimitStore.delete(key)
		}
	}
}

/**
 * Generates a CSRF token using Web Crypto API
 */
export async function generateCSRFToken(): Promise<string> {
	const buffer = new Uint8Array(32)
	crypto.getRandomValues(buffer)
	return Array.from(buffer)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
}

/**
 * Validates a CSRF token against a stored token
 */
export async function validateCSRFToken(
	token: string,
	storedToken: string
): Promise<boolean> {
	if (!token || !storedToken) return false
	if (token.length !== storedToken.length) return false

	// Constant-time comparison
	return token
		.split('')
		.reduce((acc, char, i) => acc && char === storedToken[i], true)
}

/**
 * Gets security headers configuration
 */
export async function getSecurityHeaders(): Promise<Record<string, string>> {
	return {
		'X-Frame-Options': 'DENY',
		'X-Content-Type-Options': 'nosniff',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Content-Security-Policy':
			"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
		'X-XSS-Protection': '1; mode=block',
		'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
	}
}
