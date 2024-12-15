export * from './fonts'
export * from './metadata'
export * from './feature-flags'

import { fonts, fontVariables } from './fonts/font-config'
import { featureFlags, FeatureFlag, isFeatureEnabled } from './feature-flags'
import { rootLayoutMetadata } from './metadata'

/**
 * Centralized Application Configuration
 *
 * @description
 * Single source of truth for all application configuration settings
 */
export const config = {
	fonts: {
		instances: fonts,
		variables: fontVariables
	},
	features: {
		flags: featureFlags,
		isEnabled: isFeatureEnabled,
		FeatureFlag
	},
	metadata: {
		root: rootLayoutMetadata
	}
} as const

/**
 * Type-safe configuration accessor
 *
 * @example
 * const fontSettings = getConfig('fonts')
 * const featureFlags = getConfig('features')
 */
export function getConfig<K extends keyof typeof config>(key: K) {
	return config[key]
}

export type AppConfig = typeof config
