export const AUTH_COOKIE_NAME = 'token'

// Create a secure secret key for JWT signing
export const secretKey = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key'
)

export const AUTH_CONFIG = {
	session: {
		// 30 days in milliseconds
		maxAge: 30 * 24 * 60 * 60 * 1000,
		strategy: 'jwt'
	},
	cookies: {
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/'
	}
}
