export const AUTH_COOKIE_NAME = 'token'
export const OAUTH_STATE_COOKIE_NAME = 'oauth_state'
export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 1 week

export const OAUTH_PROVIDERS = {
	GOOGLE: 'google',
	GITHUB: 'github'
} as const

export const OAUTH_SCOPES = {
	GOOGLE: ['openid', 'email', 'profile'],
	GITHUB: ['read:user', 'user:email']
} as const

export const OAUTH_ENDPOINTS = {
	GOOGLE: {
		AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
		TOKEN: 'https://oauth2.googleapis.com/token',
		USER_INFO: 'https://www.googleapis.com/oauth2/v2/userinfo'
	},
	GITHUB: {
		AUTH: 'https://github.com/login/oauth/authorize',
		TOKEN: 'https://github.com/login/oauth/access_token',
		USER_INFO: 'https://api.github.com/user',
		USER_EMAILS: 'https://api.github.com/user/emails'
	}
} as const
