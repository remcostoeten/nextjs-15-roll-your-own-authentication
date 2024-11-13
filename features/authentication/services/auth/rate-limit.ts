'use server'

import { db } from '@/app/server/database'
import { rateLimits } from '@/app/server/database/schema/rate-limits'
import { securityConfig } from '@/config'
import { MINUTES, RATE_LIMIT_WINDOW } from '@/constants'
import { and, eq, isNull, lt } from 'drizzle-orm'

const RATE_LIMIT_CONFIG = {
	WINDOW_MS: RATE_LIMIT_WINDOW, // 15 minutes
	BLOCK_DURATION: MINUTES.THIRTY, // 30 minutes
	MAX_ATTEMPTS: 5
} as const

export async function checkRateLimit(identifier: string): Promise<{
	blocked: boolean
	remainingAttempts: number
	blockedUntil?: Date
}> {
	if (!securityConfig.rateLimiting) {
		return { blocked: false, remainingAttempts: Infinity }
	}

	const now = new Date()

	// Clean up old rate limits periodically
	await db
		.delete(rateLimits)
		.where(
			and(
				lt(
					rateLimits.lastAttempt,
					new Date(now.getTime() - RATE_LIMIT_CONFIG.WINDOW_MS)
				),
				isNull(rateLimits.blockedUntil)
			)
		)

	// Get or create rate limit record
	let record = await db
		.select()
		.from(rateLimits)
		.where(eq(rateLimits.id, identifier))
		.limit(1)
		.then((records) => records[0])

	// Check if blocked
	if (record?.blockedUntil && record.blockedUntil > now) {
		return {
			blocked: true,
			remainingAttempts: 0,
			blockedUntil: record.blockedUntil
		}
	}

	// Reset if window expired or create new record
	if (
		!record ||
		now.getTime() - record.lastAttempt.getTime() >
			RATE_LIMIT_CONFIG.WINDOW_MS
	) {
		record = await db
			.insert(rateLimits)
			.values({
				id: identifier,
				attempts: 1,
				lastAttempt: now,
				blockedUntil: null
			})
			.returning()
			.then((records) => records[0])
	} else {
		// Increment attempts
		record = await db
			.update(rateLimits)
			.set({
				attempts: record.attempts + 1,
				lastAttempt: now,
				blockedUntil:
					record.attempts + 1 >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS
						? new Date(
								now.getTime() + RATE_LIMIT_CONFIG.BLOCK_DURATION
							)
						: null
			})
			.where(eq(rateLimits.id, identifier))
			.returning()
			.then((records) => records[0])
	}

	// Check if should be blocked
	if (record.attempts >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
		return {
			blocked: true,
			remainingAttempts: 0,
			blockedUntil: record.blockedUntil!
		}
	}

	return {
		blocked: false,
		remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS - record.attempts
	}
}
