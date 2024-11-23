'use server'

import { eq } from 'drizzle-orm'
import { db } from '../../server/db/drizzle'
import { rateLimits } from '../../server/db/schema'

const POINTS_PER_MINUTE = 5
const WINDOW_SIZE = 60 * 1000 // 1 minute in milliseconds

export async function checkRateLimit(
	key: string = 'default'
): Promise<boolean> {
	const now = new Date()
	const windowStart = new Date(now.getTime() - WINDOW_SIZE)

	// Clean up expired entries
	await db.delete(rateLimits).where(eq(rateLimits.expire, windowStart))

	// Get or create rate limit record
	let [record] = await db
		.select()
		.from(rateLimits)
		.where(eq(rateLimits.key, key))

	if (!record || record.expire < now) {
		// Create new record if none exists or if expired
		;[record] = await db
			.insert(rateLimits)
			.values({
				key,
				points: 1,
				expire: new Date(now.getTime() + WINDOW_SIZE)
			})
			.returning()
		return true
	}

	// Increment points
	if (record.points >= POINTS_PER_MINUTE) {
		return false
	}

	await db
		.update(rateLimits)
		.set({ points: record.points + 1 })
		.where(eq(rateLimits.key, key))

	return true
}
