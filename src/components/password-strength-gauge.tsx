'use client'

import { motion } from 'framer-motion'
import zxcvbn from 'zxcvbn'

type PasswordStrengthGaugeProps = {
	password: string
}

export default function PasswordStrengthGauge({
	password
}: PasswordStrengthGaugeProps) {
	const result = zxcvbn(password)
	const score = result.score // 0-4
	const feedback = result.feedback.warning || result.feedback.suggestions[0]

	const getStrengthColor = (score: number) => {
		switch (score) {
			case 0:
				return 'bg-red-500'
			case 1:
				return 'bg-orange-500'
			case 2:
				return 'bg-yellow-500'
			case 3:
				return 'bg-lime-500'
			case 4:
				return 'bg-green-500'
			default:
				return 'bg-gray-200'
		}
	}

	const getStrengthText = (score: number) => {
		const text =
			score === 0
				? 'Very'
				: score === 1
					? 'Weak'
					: score === 2
						? 'Fair'
						: score === 3
							? 'Strong'
							: 'Very Strong'
		const color =
			score <= 1
				? 'text-red-500'
				: score === 2
					? 'text-yellow-500'
					: 'text-green-500'
		return { text, color }
	}

	return (
		<div className="space-y-2">
			{score <= 1 && password && (
				<div className="flex gap-1.5 items-baseline">
					<span className="text-red-500">Very</span>
					<span className="text-red-500">Weak</span>
					{feedback && (
						<span className="text-muted-foreground text-sm ml-1">
							{feedback}
						</span>
					)}
				</div>
			)}
			<div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
				<motion.div
					className={`h-full ${getStrengthColor(score)}`}
					initial={{ width: '0%' }}
					animate={{ width: `${(score + 1) * 20}%` }}
					transition={{ duration: 0.3 }}
				/>
			</div>
		</div>
	)
}
