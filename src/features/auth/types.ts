import { User as DbUser } from '@/db/schema'

// Base user type from database schema
export type User = DbUser

// Service interfaces with simpler typing
export type StorageService = {
	saveUser: (_: {
		email: string
		password: string
		role?: 'user' | 'admin'
	}) => Promise<User>
	findUserByEmail: (_: string) => Promise<User | null>
	findUserById: (_: string) => Promise<User | null>
}

export type AuthService = {
	createUser: (_email: string, _password: string) => Promise<User>
	validateUser: (_email: string, _password: string) => Promise<User | null>
	getUserById: (_id: string) => Promise<User | null>
}

// Session user type
export type SessionUser = {
	userId: string
	email: string
	role: 'admin' | 'user'
}

// Form error types
export type FieldErrors = {
	email?: string[]
	password?: string[]
	confirmPassword?: string[]
}

export type FormError = {
	_form?: string[]
}

// Auth state types
export type AuthState = {
	isAuthenticated: boolean
	user?: SessionUser
	isLoading: boolean
	error?: FieldErrors & FormError
}

// Auth context type
export type AuthContextType = {
	isAuthenticated: boolean
	user?: SessionUser
	isLoading: boolean
	updateAuthState: (_: Partial<AuthState>) => void
}

// Auth action result type
export type AuthResult =
	| { success: true; user: SessionUser }
	| { success: false; error: FieldErrors & FormError }

// Auth action types
export type AuthAction = {
	type: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'UPDATE_PROFILE'
	payload?: Record<string, unknown>
}
