type UserData = {
	emailVerified: boolean
	lastLoginAttempt?: Date
	passwordChangedAt?: Date
	recentActivity?: Array<{ status: string }>
	role: string
}

export function calculateSecurityScore(userData: UserData): number {
	if (!userData) return 0

	let score = 0

	// Basic boolean check for email verification
	if (userData.emailVerified) score += 20

	// Date existence checks
	if (userData.lastLoginAttempt instanceof Date) score += 20
	if (userData.passwordChangedAt instanceof Date) score += 20

	// Safe check for recentActivity array and its contents
	const hasValidActivity =
		Array.isArray(userData.recentActivity) &&
		userData.recentActivity.length > 0 &&
		!userData.recentActivity.some(
			(activity) => activity?.status === 'error'
		)

	if (hasValidActivity) score += 20

	// Role check
	if (userData.role === 'user') score += 20

	return score
}
