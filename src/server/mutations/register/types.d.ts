export type RegisterResponse = {
	success: boolean
	error?: string
	user?: {
		id: number
		email: string
		firstName: string | null
		lastName: string | null
		name: string | null
		image: string | null
		provider: string | null
	}
}
