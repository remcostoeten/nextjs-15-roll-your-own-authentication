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
	user?: SessionUser
}
