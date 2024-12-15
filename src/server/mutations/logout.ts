'use server'

import { cookies } from 'next/headers'
import prisma from '@/server/db'

export async function logout() {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('token')?.value

		if (token) {
			// Delete the session from the database
			try {
				const { jwtVerify } = await import('jose')
				const secretKey = new TextEncoder().encode(
					process.env.JWT_SECRET || 'your-secret-key'
				)
				const { payload } = await jwtVerify(token, secretKey)

				if (
					payload &&
					typeof payload === 'object' &&
					'sessionToken' in payload
				) {
					await prisma.session.delete({
						where: {
							id: payload.sessionToken as string
						}
					})
				}
			} catch (error) {
				console.error('Error deleting session:', error)
			}

			// Delete the token cookie
			cookieStore.delete('token')
		}

		return { success: true }
	} catch (error) {
		console.error('Logout error:', error)
		return { success: false, error: 'Failed to logout' }
	}
}
