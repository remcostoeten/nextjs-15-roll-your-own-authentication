import { getSession } from '../session'
import { SessionUser } from '../types'
import { AuthIndicatorClient } from './session-indicator'

export async function AuthIndicator() {
	const session = await getSession()

	const initialState = {
		isAuthenticated: false,
		user: undefined as SessionUser | undefined
	}

	if (session) {
		initialState.isAuthenticated = true
		initialState.user = {
			userId: session.userId,
			email: session.email,
			role: session.role ?? 'user'
		}
	}

	return <AuthIndicatorClient initialState={initialState} />
}
