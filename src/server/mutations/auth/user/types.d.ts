export type User = {
	id: number
	email: string
	password: string | null
	firstName: string | null
	lastName: string | null
	name: string | null
	image: string | null
	provider: string | null
	emailVerified: Date | null
}

export type UserResponse = Pick<
	User,
	'id' | 'email' | 'firstName' | 'lastName' | 'name' | 'image' | 'provider'
>

export type AuthResponse = {
	success?: boolean
	error?: string
	user?: User
}
