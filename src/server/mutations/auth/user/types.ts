export type User = {
	id: number
	email: string
	firstName: string | null
	lastName: string | null
	name: string | null
	image: string | null
	provider: string | null
	emailVerified: Date | null
}

export type AuthResponse = {
	success: boolean
	error?: string
	user?: User
}

export type UserResponse = AuthResponse

export type SessionResponse = {
	success: boolean
	error?: string
	sessionToken?: string
}
