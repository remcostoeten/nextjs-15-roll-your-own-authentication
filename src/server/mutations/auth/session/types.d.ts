export type SessionResponse = {
	id: string
	userId: number
	expiresAt: Date
}

export type JWTPayload = {
	userId: number
	sessionToken: string
	type: 'session'
}
