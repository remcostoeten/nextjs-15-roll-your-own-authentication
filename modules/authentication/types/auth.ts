export type TokenPayload = {
	id: string
	email: string
	role: 'user' | 'admin'
	// Add other user properties as needed
}
