export type PasswordStrength =
	| 'very-weak'
	| 'weak'
	| 'medium'
	| 'strong'
	| 'very-strong'

export interface PasswordRequirement {
	label: string
	validator: (password: string) => boolean
}

export interface PasswordStrengthGaugeProps {
	password: string
	className?: string
}
