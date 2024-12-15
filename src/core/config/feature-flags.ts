/**
 * Feature Flag Management System
 *
 * @description
 * Provides a centralized, type-safe mechanism for managing application features.
 *
 * @usage
 * 1. Check if a feature is enabled:
 * ```typescript
 * if (isFeatureEnabled(FeatureFlag.FONT_SWITCHER)) {
 *   // Render font switcher component
 * }
 * ```
 *
 * 2. Disable/Enable features:
 * ```typescript
 * // To disable a feature
 * featureFlags[FeatureFlag.FONT_SWITCHER] = false
 *
 * // To enable a feature
 * featureFlags[FeatureFlag.FONT_SWITCHER] = true
 * ```
 *
 * @remarks
 * - Features are boolean toggles
 * - Easily extensible
 * - Centralized configuration
 */
export enum FeatureFlag {
	/** Enables/disables session activity indicator */
	SHOW_SESSION_INDICATOR = 'SHOW_SESSION_INDICATOR',

	/** Enables/disables font switcher functionality */
	FONT_SWITCHER = 'FONT_SWITCHER',

	/** Enables/disables developer tools */
	DEV_TOOLS = 'DEV_TOOLS',

	/** Enables/disables password strength checker */
	PASSWORD_STRENGTH_CHECKER = 'PASSWORD_STRENGTH_CHECKER',

	/** Enables/disables forgot password functionality */
	FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}

/**
 * Current feature flag states
 *
 * @description
 * Centralized object storing the enabled/disabled state of application features
 */
export const featureFlags: Record<FeatureFlag, boolean> = {
	[FeatureFlag.SHOW_SESSION_INDICATOR]: true,
	[FeatureFlag.FONT_SWITCHER]: true,
	[FeatureFlag.DEV_TOOLS]: true,
	[FeatureFlag.PASSWORD_STRENGTH_CHECKER]: true,
	[FeatureFlag.FORGOT_PASSWORD]: false //ToDo: Implement forgot password. The ui is done. brrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
} as const

/**
 * Check if a specific feature is currently enabled
 *
 * @param feature - The feature flag to check
 * @returns Boolean indicating if the feature is enabled
 *
 * @example
 * const isFontSwitcherEnabled = isFeatureEnabled(FeatureFlag.FONT_SWITCHER)
 * if (isFontSwitcherEnabled) {
 *   // Render font switcher
 * }
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
	return featureFlags[feature]
}

/**
 * Get all currently enabled features
 *
 * @returns Array of enabled feature flags
 *
 * @example
 * const activeFeatures = getEnabledFeatures()
 * console.log(activeFeatures)
 * // Output: ['SHOW_SESSION_INDICATOR', 'FONT_SWITCHER', ...]
 */
export default function getEnabledFeatures(): FeatureFlag[] {
	return Object.entries(featureFlags)
		.filter(([, isEnabled]) => isEnabled)
		.map(([feature]) => feature as FeatureFlag)
}
