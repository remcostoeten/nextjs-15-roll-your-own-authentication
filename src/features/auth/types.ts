import { User as DbUser } from '@/db/schema'

// Base user type from database schema
export type User = DbUser

// Service interfaces
export type StorageService = {
	saveUser(userData: {
		email: string
		password: string
		role?: 'user' | 'admin'
	}): Promise<User>
	findUserByEmail(email: string): Promise<User | null>
	findUserById(id: string): Promise<User | null>
}

export type AuthService = {
	createUser(email: string, password: string): Promise<User>
	validateUser(email: string, password: string): Promise<User | null>
	getUserById(id: string): Promise<User | null>
}

// Session user type
export type SessionUser = {
	userId: string
	email: string
	role: string
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

export type AuthState =
	| {
			error: FieldErrors & FormError
	  }
	| {
			redirect: string
	  }
	| null

export type AuthContextType = {
	isAuthenticated: boolean
	user?: SessionUser
	loading: boolean
}
