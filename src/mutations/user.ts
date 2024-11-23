'use server'

import { getUser as getUserService } from '../services/auth/get-user'

export async function getUserMutation() {
	try {
		const user = await getUserService()
		return { success: true, user }
	} catch (error) {
		console.error('Get user error:', error)
		return { success: false, error: 'Failed to get user' }
	}
}
