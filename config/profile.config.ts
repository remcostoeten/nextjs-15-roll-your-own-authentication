import { UPLOAD_LIMITS } from '@/constants'
import { getFeatureConfig } from './features.config'

export const profilesConfig = {
	...getFeatureConfig('profiles'),

	ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
	MAX_AVATAR_SIZE: UPLOAD_LIMITS.DOCUMENT,

	isValidImageType(mimeType: string) {
		return this.ALLOWED_IMAGE_TYPES.includes(mimeType)
	},

	get SOCIAL_PLATFORMS() {
		return {
			twitter: { baseUrl: 'https://twitter.com/', maxLength: 15 },
			github: { baseUrl: 'https://github.com/', maxLength: 39 },
			linkedin: { baseUrl: 'https://linkedin.com/in/', maxLength: 100 }
		} as const
	}
}

export type ProfilesConfig = typeof profilesConfig
