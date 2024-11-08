export type User = {
	id: string
	email: string
	password: string
	createdAt: string
	role: 'user' | 'admin'
}

export type SessionUser = {
	userId: string
	email: string
	role: 'user' | 'admin'
	name?: string
}

export type FieldErrors = {
	email?: string[]
	password?: string[]
	confirmPassword?: string[]
}

export type FormError = {
	_form?: string[]
}

export type AuthState = {
	isAuthenticated: boolean
	isLoading: boolean
	error?: {
		email?: string[]
		password?: string[]
		confirmPassword?: string[]
		_form?: string[]
	}
	success?: boolean
	user?: SessionUser
}

export type AuthService = {
	createUser(email: string, password: string): Promise<User>
	validateUser(email: string, password: string): Promise<User | null>
	getUserById(id: string): Promise<User | null>
}

export type TokenService = {
	generateToken(payload: SessionUser): string
	verifyToken(token: string): SessionUser | null
}

export type StorageService = {
	saveUser(user: {
		email: string
		password: string
		role?: 'user' | 'admin'
	}): Promise<User>
	findUserByEmail(email: string): Promise<User | null>
	findUserById(id: string): Promise<User | null>
}
