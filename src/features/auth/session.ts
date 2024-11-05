'use server'

import { cookies } from 'next/headers'
import type { SessionUser, TokenService } from './types'

export type SessionOptions = {
	maxAge?: number
	secure?: boolean
}

export class SessionManager {
	private readonly cookieName = 'session'
	private readonly defaultOptions: SessionOptions = {
		maxAge: 86400, // 1 day
		secure: process.env.NODE_ENV === 'production'
	}

	constructor(private tokenService: TokenService) {}

	async setSession(
		userId: string,
		userData: Partial<Omit<SessionUser, 'userId'>> = {},
		options?: SessionOptions
	) {
		const sessionData: SessionUser = {
			userId,
			email: userData.email || '',
			role: userData.role || 'user',
			name: userData.name
		}

		const token = this.tokenService.generateToken(sessionData)
		const { maxAge, secure } = { ...this.defaultOptions, ...options }

		;(await cookies()).set(this.cookieName, token, {
			httpOnly: true,
			secure,
			sameSite: 'lax',
			maxAge
		})

		return sessionData
	}

	async getSession(): Promise<SessionUser | null> {
		const token = (await cookies()).get(this.cookieName)?.value

		if (!token) {
			return null
		}

		return this.tokenService.verifyToken(token)
	}

	async clearSession() {
		;(await cookies()).delete(this.cookieName)
	}
}
