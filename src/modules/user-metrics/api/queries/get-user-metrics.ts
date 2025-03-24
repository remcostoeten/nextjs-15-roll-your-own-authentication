'use server'

import { db } from '@/server/db'
import { userMetrics, users } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'
import { formatDistanceToNow, differenceInDays, isToday, isYesterday } from 'date-fns'

export const getUserMetrics = async (userId: string) => {
	// Get the user metrics
	const metrics = await db.query.userMetrics.findFirst({
		where: eq(userMetrics.userId, userId),
		with: {
			user: true,
		},
	})

	// If no metrics exist, fetch the user and create a new metrics record
	if (!metrics) {
		const user = await db.query.users.findFirst({
			where: eq(users.id, userId),
		})

		if (!user) {
			throw new Error('User not found')
		}

		// Calculate days since account creation
		const accountAge = differenceInDays(new Date(), user.createdAt)

		// Create a new metrics record
		const newMetrics = await db
			.insert(userMetrics)
			.values({
				userId,
				loginStreak: 1, // First login
				lastLogin: new Date(),
				loginCount: 1,
			})
			.returning()

		if (!newMetrics[0]) {
			throw new Error('Failed to create user metrics')
		}

		return {
			...newMetrics[0],
			accountAge: formatAccountAge(accountAge),
			lastLoginFormatted: formatLastLogin(new Date()),
		}
	}

	// Format the account age
	const user = metrics.user
	const accountAge = differenceInDays(new Date(), user.createdAt)

	// Format the last login date
	const lastLoginFormatted = metrics.lastLogin ? formatLastLogin(metrics.lastLogin) : 'Never'

	return {
		...metrics,
		accountAge: formatAccountAge(accountAge),
		lastLoginFormatted,
	}
}

// Helper function to format account age
function formatAccountAge(days: number): string {
	if (days === 0) {
		return 'Today'
	} else if (days === 1) {
		return '1 day'
	} else {
		return `${days} days`
	}
}

// Helper function to format last login
function formatLastLogin(date: Date): string {
	if (isToday(date)) {
		return 'Today'
	} else if (isYesterday(date)) {
		return 'Yesterday'
	} else {
		return formatDistanceToNow(date, { addSuffix: true })
	}
}
