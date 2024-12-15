import { useState, useEffect } from 'react'
import { calculatePasswordStrength, passwordRequirements } from './utils'
import { PasswordStrengthGaugeProps } from './strenght'
import { cn } from 'helpers'
import { PasswordRequirementList } from './password-requirments'
import { PasswordStrengthGauge } from './password-strenght-gauge'
import { PasswordStrength } from './types'

export function PasswordStrengthIndicator({
	password,
	className
}: PasswordStrengthGaugeProps) {
	const [strength, setStrength] = useState<PasswordStrength>('very-weak')
	const [score, setScore] = useState(0)

	useEffect(() => {
		if (password.length === 0) return
		const [newStrength, newScore] = calculatePasswordStrength(password)
		setStrength(newStrength as PasswordStrength)
		setScore(newScore)
	}, [password])

	if (password.length === 0) return null

	return (
		<div className={cn('space-y-2', className)}>
			<PasswordStrengthGauge
				strength={strength}
				score={score}
				password={password}
			/>
			<PasswordRequirementList
				password={password}
				requirements={passwordRequirements}
			/>
		</div>
	)
}
