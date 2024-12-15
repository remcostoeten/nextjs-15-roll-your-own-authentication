/**
 * Password Strength Configuration
 *
 * @description
 * Comprehensive configuration for password strength validation and scoring
 *
 * @usage
 * ```typescript
 * import { passwordStrengthConfig, calculatePasswordStrength } from './password-strength-config'
 *
 * function validatePassword(password: string) {
 *   const strength = calculatePasswordStrength(password)
 *
 *   if (strength < passwordStrengthConfig.minStrengthRequired) {
 *     throw new Error('Password is too weak')
 *   }
 * }
 * ```
 *
 * @remarks
 * - Configurable strength requirements
 * - Flexible scoring system
 * - Easily customizable
 */
export const passwordStrengthConfig = {
	/** Flag to enable/disable password strength checking */
	enabled: true,

	/** Minimum password length */
	minLength: 8,

	/** Require at least one uppercase letter */
	requireUppercase: true,

	/** Require at least one lowercase letter */
	requireLowercase: true,

	/** Require at least one number */
	requireNumbers: true,

	/** Require at least one special character */
	requireSpecialChars: true,

	/** Minimum strength score required */
	minStrengthRequired: 2, // 0-4 scale

	/** Strength level definitions */
	strengthLevels: [
		{ label: 'Very Weak', color: 'red', minScore: 0 },
		{ label: 'Weak', color: 'orange', minScore: 1 },
		{ label: 'Fair', color: 'yellow', minScore: 2 },
		{ label: 'Good', color: 'lime', minScore: 3 },
		{ label: 'Strong', color: 'green', minScore: 4 }
	]
} as const

/**
 * Calculate password strength
 *
 * @param password - Password to evaluate
 * @returns Strength score (0-4)
 *
 * @example
 * const score = calculatePasswordStrength('myPassword123!')
 * console.log(score) // Outputs strength score
 */
export function calculatePasswordStrength(password: string): number {
	let score = 0

	// Length check
	if (password.length >= passwordStrengthConfig.minLength) score++

	// Uppercase check
	if (passwordStrengthConfig.requireUppercase && /[A-Z]/.test(password))
		score++

	// Lowercase check
	if (passwordStrengthConfig.requireLowercase && /[a-z]/.test(password))
		score++

	// Number check
	if (passwordStrengthConfig.requireNumbers && /[0-9]/.test(password)) score++

	// Special character check
	if (
		passwordStrengthConfig.requireSpecialChars &&
		/[!@#$%^&*()]/.test(password)
	)
		score++

	return Math.min(score, 4)
}

/**
 * Get strength level details for a given score
 *
 * @param score - Password strength score
 * @returns Strength level details
 *
 * @example
 * const levelDetails = getStrengthLevelDetails(3)
 * console.log(levelDetails.label) // 'Good'
 */
export function getStrengthLevelDetails(score: number) {
	return passwordStrengthConfig.strengthLevels.findLast(
		(level) => score >= level.minScore
	)
}
