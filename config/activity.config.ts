import { getFeatureConfig } from './features.config'

export const activityConfig = {
	...getFeatureConfig('activity'),

	LOG_RETENTION_DAYS: 30,

	get LOG_LEVELS() {
		return {
			INFO: 'info',
			WARN: 'warn',
			ERROR: 'error'
		} as const
	},

	shouldLogActivity(type: keyof typeof this.LOG_LEVELS) {
		if (!this.enabled) return false

		switch (type) {
			case 'ERROR':
				return this.logFailedAttempts
			case 'INFO':
				return this.logDeviceInfo
			default:
				return true
		}
	}
}

export type ActivityConfig = typeof activityConfig
