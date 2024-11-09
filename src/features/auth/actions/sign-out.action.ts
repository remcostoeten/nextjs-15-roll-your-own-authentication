import { SessionService } from '../services'
import type { AuthState } from '../types'

export async function signOut(): Promise<AuthState> {
	try {
		const sessionService = new SessionService()
		await sessionService.clearSession()

		return {
			isAuthenticated: false,
			isLoading: false
		}
	} catch (error) {
		console.error('SignOut error:', error)
		return {
			isAuthenticated: false,
			isLoading: false,
			error: {
				_form: ['Failed to sign out']
			}
		}
	}
}
