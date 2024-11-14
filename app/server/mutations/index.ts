import { UserProfile } from '@/features/authentication/types'

export type LoginResponse = {
	success: boolean
	message: string
	user: UserProfile
	error?: string
	remainingAttempts?: number
}

export type { LogoutResponse } from './logout'
export type { RegisterResponse } from './register'

export { login } from './login'
export { logout } from './logout'
export { register } from './register'
