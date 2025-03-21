/**
 * Optimized Barrel File for Demo Modules
 *
 * This file uses path-specific exports instead of re-exporting everything,
 * which ensures proper tree-shaking and prevents the entire module from
 * being included when only one component is needed.
 */

// Colors module - Component exports
export { ColorCard } from './colors/components/color-card'
export { ColorsGrid } from './colors/components/colors-grid'
export { Hero as ColorsHero } from './colors/components/colors-hero'

// Colors module - Utility exports
export { parseColorVariables } from './colors/helpers/color-parser'

// Colors module - Type exports
export type { ColorVariable } from './colors/types'

// Add future demo exports here with specific paths
