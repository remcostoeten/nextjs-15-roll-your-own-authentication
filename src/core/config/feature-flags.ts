/**
 * Feature Flag Management System
 *
 * @description
 * Provides a centralized, type-safe mechanism for managing application features.
 */

// Feature flags for the application
const FEATURE_FLAGS = {
  MATRIX_GRID: {
    ENABLED: true,
    ANIMATIONS: true,
  },
  // Add other feature flags here
} as const

export const isMatrixGridAnimationEnabled = (feature: keyof typeof FEATURE_FLAGS.MATRIX_GRID) => {
  return FEATURE_FLAGS.MATRIX_GRID.ENABLED && FEATURE_FLAGS.MATRIX_GRID.ANIMATIONS
}

export type FeatureFlags = typeof FEATURE_FLAGS

/**
 * Check if a specific feature is currently enabled
 */
export function isFeatureEnabled(feature: FeatureFlags): boolean {
  return FEATURE_FLAGS[feature]
}

/**
 * Check if a specific Matrix Grid accessibility feature is enabled
 */
export function isMatrixGridAccessibilityFeatureEnabled(
  featureKey: keyof typeof FEATURE_FLAGS.MATRIX_GRID,
): boolean {
  return FEATURE_FLAGS.MATRIX_GRID[featureKey]
}

