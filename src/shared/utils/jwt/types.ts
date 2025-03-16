export type TokenPayload = {
	sub: string // User ID
	email: string
	iat?: number // Issued at
	exp?: number // Expiration time
	jti?: string // JWT ID
}

export type Tokens = {
	accessToken: string
	refreshToken: string
}
