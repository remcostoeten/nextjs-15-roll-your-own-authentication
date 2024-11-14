'use client'

import { cn } from 'helpers'
import { useEffect, useState } from 'react'

type PasswordStrength = {
	score: number // 0-4
	feedback: string
}

type PasswordStrengthIndicatorProps = {
	password: string
	className?: string
}

export default function PasswordStrengthIndicator({
	password,
	className
}: PasswordStrengthIndicatorProps) {
	const [strength, setStrength] = useState<PasswordStrength>({
		score: 0,
		feedback: ''
	})
	const [isAnimating, setIsAnimating] = useState(false)

	useEffect(() => {
		setIsAnimating(true)

		if (!password) {
			setStrength({ score: 0, feedback: '' })
			return
		}

		// Calculate password strength
		const hasLength = password.length >= 8
		const hasNumber = /\d/.test(password)
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
		const hasUpper = /[A-Z]/.test(password)
		const hasLower = /[a-z]/.test(password)

		let score = 0
		if (hasLength) score++
		if (hasNumber) score++
		if (hasSpecial) score++
		if (hasUpper && hasLower) score++

		const feedbacks = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']

		setStrength({
			score,
			feedback: feedbacks[score]
		})

		// Reset animation flag after a brief delay
		const timer = setTimeout(() => setIsAnimating(false), 300)
		return () => clearTimeout(timer)
	}, [password])

	return (
		<div className={cn('space-y-2', className)}>
			<div className="flex gap-1">
				{[0, 1, 2, 3, 4].map((index) => (
					<div
						key={index}
						className="h-2 w-full relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
					>
						<div
							className={cn(
								'absolute inset-0 rounded-full transition-all duration-500 ease-out',
								isAnimating && 'scale-x-100',
								{
									'bg-red-500 scale-x-100':
										strength.score === 1 && index === 0,
									'bg-orange-500 scale-x-100':
										strength.score === 2 && index <= 1,
									'bg-yellow-500 scale-x-100':
										strength.score === 3 && index <= 2,
									'bg-green-500 scale-x-100':
										strength.score === 4 && index <= 3,
									'scale-x-0': index >= strength.score
								}
							)}
							style={{
								transformOrigin: 'left',
								transition: `transform 500ms ${index * 100}ms ease-out, background-color 500ms ease`
							}}
						/>
					</div>
				))}
			</div>
			{strength.feedback && (
				<p
					className={cn('text-xs transition-colors duration-300', {
						'text-red-500': strength.score === 1,
						'text-orange-500': strength.score === 2,
						'text-yellow-500': strength.score === 3,
						'text-green-500': strength.score === 4
					})}
				>
					{strength.feedback}
				</p>
			)}
		</div>
	)
}
