export interface User {
	id: number
	email: string
	password: string
	role: 'user' | 'admin'
	emailVerified: boolean
	createdAt: Date
}

export interface Session {
	id: number
	userId: number
	token: string
	expiresAt: Date
	createdAt: Date
}

export interface EmailVerification {
	id: number
	userId: number
	token: string
	expiresAt: Date
	createdAt: Date
}
