'use server'

import { eq, sql } from 'drizzle-orm'
import { createEntity } from '../server/db/generics/entity'
import { loginHistory } from '../server/db/schema'

type LocationData = {
	country?: string
	city?: string
}

type LoginHistoryRecord = {
	id: number
	userId: number
	timestamp: Date
	userAgent?: string | null
	ipAddress?: string | null
	location: LocationData | null
	success: boolean
	month: Date
	count: number
}

const loginHistoryEntity = createEntity(loginHistory)

export async function getUserAnalytics(userId: number) {
	const loginHistoryData = await loginHistoryEntity.read(
		eq(loginHistory.userId, userId)
	)

	// Type assertion for the raw data
	const typedLoginHistory = loginHistoryData.map((record) => ({
		...record,
		location: record.location
			? (JSON.parse(record.location as string) as LocationData)
			: null
	})) as LoginHistoryRecord[]

	const totalLogins = typedLoginHistory.length
	const lastLogin = typedLoginHistory[0]?.timestamp

	const uniqueUserAgents = new Set(
		typedLoginHistory.map((login) => login.userAgent).filter(Boolean)
	)

	const uniqueLocations = new Set(
		typedLoginHistory.map((login) => {
			if (!login.location) return 'Unknown Location'
			const loc = login.location as LocationData
			return `${loc.country || 'Unknown'}, ${loc.city || 'Unknown'}`
		})
	)

	const lastFiveLogins = typedLoginHistory.slice(0, 5)

	const loginsByMonth = await loginHistoryEntity.read(
		sql`DATE_TRUNC('month', ${loginHistory.timestamp}) as month, COUNT(*) as count`
			.append(sql`WHERE ${loginHistory.userId} = ${userId}`)
			.append(
				sql`GROUP BY DATE_TRUNC('month', ${loginHistory.timestamp})`
			)
			.append(
				sql`ORDER BY DATE_TRUNC('month', ${loginHistory.timestamp}) DESC`
			)
	)

	return {
		totalLogins,
		lastLogin,
		uniqueUserAgents: Array.from(uniqueUserAgents),
		uniqueLocations: Array.from(uniqueLocations),
		lastFiveLogins,
		loginsByMonth
	}
}
