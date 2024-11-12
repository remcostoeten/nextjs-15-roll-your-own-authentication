export type User = {
	id: string
	email: string
	name?: string
	image?: string
	// Add any other user properties you need
}

export type Session = {
	user: User | null
	expires: string
}
