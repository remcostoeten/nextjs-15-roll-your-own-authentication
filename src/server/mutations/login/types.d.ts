export type LoginResponse = {
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
