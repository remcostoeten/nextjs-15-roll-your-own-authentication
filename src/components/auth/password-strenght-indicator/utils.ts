import { PasswordRequirement } from './strenght'
import { PasswordStrength } from './types'

export const passwordRequirements: PasswordRequirement[] = [
	{
		label: 'At least 8 characters',
		validator: (password: string) => password.length >= 8
	},
	{
		label: 'Contains uppercase letter',
		validator: (password: string) => /[A-Z]/.test(password)
	},
	{
		label: 'Contains lowercase letter',
		validator: (password: string) => /[a-z]/.test(password)
	},
	{
		label: 'Contains number',
		validator: (password: string) => /\d/.test(password)
	},
	{
		label: 'Contains special character',
		validator: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
	}
]

export const calculatePasswordStrength = (
	password: string
): [PasswordStrength, number] => {
	const score = passwordRequirements.reduce(
		(acc, requirement) => acc + (requirement.validator(password) ? 1 : 0),
		0
	)

	const strength: PasswordStrength =
		score === 0
			? 'very-weak'
			: score === 1
				? 'weak'
				: score === 2
					? 'medium'
					: score === 3
						? 'strong'
						: 'very-strong'

	return [strength, score]
}
