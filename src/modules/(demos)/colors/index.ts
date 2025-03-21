/**
 * Colors Module - Optimized Barrel File
 *
 * This file uses explicit named exports to enable proper tree-shaking
 * and avoid bundling the entire module when only specific parts are needed.
 */

// Re-export components with their original names
export { ColorCard } from './components/color-card'
export { ColorsGrid } from './components/colors-grid'
export { Hero } from './components/colors-hero'

// Re-export utilities
export { parseColorVariables } from './helpers/color-parser'

// Re-export types
export type { ColorVariable } from './types'
