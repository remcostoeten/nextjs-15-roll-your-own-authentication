import { RATE_LIMIT_WINDOW } from '@/constants'
import { getFeatureConfig } from './features.config'

export const securityConfig = {
	...getFeatureConfig('security'),

	RATE_LIMIT: {
		windowMs: RATE_LIMIT_WINDOW,
		max: 100
	},

	IP_BLOCKLIST: new Set<string>(),

	get CORS_OPTIONS() {
		return {
			origin: process.env.ALLOWED_ORIGINS?.split(',') || [
				'http://localhost:3000'
			],
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
		} as const
	},

	isIpBlocked(ip: string) {
		return this.ipBlocking && this.IP_BLOCKLIST.has(ip)
	},

	addBlockedIp(ip: string) {
		if (this.ipBlocking) {
			this.IP_BLOCKLIST.add(ip)
		}
	}
}

export type SecurityConfig = typeof securityConfig
