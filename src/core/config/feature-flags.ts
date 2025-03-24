/**
 * Feature Flag Management System
 *
 * @description
 * Provides a centralized, type-safe mechanism for managing application features.
 */

type MatrixGridFeatures = {
	ENABLED: boolean
	ANIMATIONS: boolean
}

// Feature flags for the application
const MATRIX_GRID_FLAGS: MatrixGridFeatures = {
	ENABLED: true,
	ANIMATIONS: true,
} as const

export const isMatrixGridAnimationEnabled = (feature: keyof MatrixGridFeatures): boolean => {
	return MATRIX_GRID_FLAGS[feature]
}

/**
 * Check if a specific Matrix Grid accessibility feature is enabled
 */
export function isMatrixGridAccessibilityFeatureEnabled(featureKey: keyof MatrixGridFeatures): boolean {
	return MATRIX_GRID_FLAGS[featureKey]
}
