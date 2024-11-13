'use server'

import { activityLogs, sessions } from '@/features/authentication'
import { db } from 'db'
import { eq } from 'drizzle-orm'
import { cookies, headers } from 'next/headers'

export type LogoutResponse = {
	success: boolean
	error?: string
}

export async function logout(): Promise<LogoutResponse> {
	try {
		const token = (await cookies()).get('auth_token')?.value
		if (token) {
			const session = await db
				.select()
				.from(sessions)
				.where(eq(sessions.token, token))
				.limit(1)

			if (session.length > 0) {
				const headersList = await headers()
				const userAgent = headersList.get('user-agent')
				const ip = headersList.get('x-forwarded-for') || 'unknown'

				await db.insert(activityLogs).values({
					userId: session[0].userId,
					type: 'logout',
					status: 'success',
					ipAddress: ip,
					userAgent,
					details: {
						message: 'User logged out'
					}
				})

				await db.delete(sessions).where(eq(sessions.token, token))
			}
		}

		;(await cookies()).delete('auth_token')
		return { success: true }
	} catch (error) {
		console.error('Logout error:', error)
		return { success: false, error: 'Logout failed' }
	}
}
