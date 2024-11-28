import { db } from '../server/db/drizzle'
import { loginHistory } from '../server/db/schema'

type LocationData = {
	country?: string
	city?: string
	latitude?: number
	longitude?: number
}

export type LoginHistoryInsert = {
	userId: number
	userAgent?: string
	ipAddress?: string
	location?: LocationData
	success?: boolean
}

export async function recordLogin(data: LoginHistoryInsert) {
	return await db.insert(loginHistory).values(data).returning()
}
