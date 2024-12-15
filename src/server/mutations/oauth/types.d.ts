export type OAuthProvider = 'google' | 'github'

export type OAuthResponse = {
	success: boolean
	error?: string
	redirectUrl?: string
}
