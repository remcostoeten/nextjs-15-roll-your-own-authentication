import { MATRIX_GRID_CONFIG } from "../../components/matrix-grid/matrix-grid-config"

/**
 * Feature Flag Management System
 *
 * @description
 * Provides a centralized, type-safe mechanism for managing application features.
 */

export const featureFlags = {
  ANIMATIONS: {
    grid: true,
  },
  MATRIX_GRID: MATRIX_GRID_CONFIG,
} as const

export type FeatureFlag = keyof typeof featureFlags

/**
 * Check if a specific feature is currently enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return featureFlags[feature]
}

/**
 * Check if a specific Matrix Grid animation is enabled
 */
export function isMatrixGridAnimationEnabled(animationKey: keyof typeof featureFlags.ANIMATIONS): boolean {
  return featureFlags.ANIMATIONS[animationKey]
}

/**
 * Check if a specific Matrix Grid accessibility feature is enabled
 */
export function isMatrixGridAccessibilityFeatureEnabled(
  featureKey: keyof typeof MATRIX_GRID_CONFIG.ACCESSIBILITY,
): boolean {
  return MATRIX_GRID_CONFIG.ACCESSIBILITY[featureKey]
}

