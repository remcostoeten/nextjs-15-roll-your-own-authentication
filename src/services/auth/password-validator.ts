import zxcvbn from 'zxcvbn'

export function validatePassword(password: string): {
	isValid: boolean
	feedback: string
} {
	const result = zxcvbn(password)

	if (result.score < 3) {
		return {
			isValid: false,
			feedback:
				result.feedback.warning ||
				'Password is too weak. Please choose a stronger password.'
		}
	}

	return { isValid: true, feedback: 'Password is strong.' }
}
