export class AuthError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode: number = 400
	) {
		super(message)
		this.name = 'AuthError'
	}
}

export class OAuthError extends AuthError {
	constructor(message: string, provider?: string) {
		super(message, 'oauth_error', 400)
		this.name = 'OAuthError'
		if (provider) {
			this.message = `${provider} OAuth error: ${message}`
		}
	}
}

export class StateError extends AuthError {
	constructor() {
		super('Invalid state parameter', 'invalid_state', 400)
		this.name = 'StateError'
	}
}

export class ConfigError extends AuthError {
	constructor(message: string) {
		super(message, 'config_error', 500)
		this.name = 'ConfigError'
	}
}
