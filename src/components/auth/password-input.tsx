'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

type PasswordInputProps = {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
}

/**
 * Calculates password strength based on various criteria
 */
function calculatePasswordStrength(password: string): number {
	if (!password) return 0

	let strength = 0
	const criteria = {
		length:
			password.length >= 8 ? 25 : Math.round((password.length / 8) * 25),
		hasUppercase: /[A-Z]/.test(password) ? 25 : 0,
		hasLowercase: /[a-z]/.test(password) ? 15 : 0,
		hasNumbers: /\d/.test(password) ? 20 : 0,
		hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 15 : 0
	}

	strength = Object.values(criteria).reduce((acc, curr) => acc + curr, 0)
	return Math.min(strength, 100)
}

export default function PasswordInput({
	value,
	onChange,
	placeholder = 'Password',
	className = ''
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false)
	const strength = calculatePasswordStrength(value)
	const shouldShowStrength = value.length > 0

	return (
		<div className="relative w-full">
			<div className="relative">
				<input
					type={showPassword ? 'text' : 'password'}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className={`w-full pr-10 ${className}`}
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
				</button>
			</div>

			<AnimatePresence>
				{shouldShowStrength && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-2"
					>
						<div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
							{value.length > 0 && (
								<motion.div
									className={`h-full ${getStrengthColor(strength)}`}
									initial={{ width: 0 }}
									animate={{ width: `${strength}%` }}
									transition={{ duration: 0.3 }}
								/>
							)}
						</div>
						<motion.p
							className="text-xs text-gray-500 mt-1"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							{value.length === 0
								? 'Enter a password'
								: getStrengthLabel(strength)}
						</motion.p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

function getStrengthColor(strength: number): string {
	if (strength === 0) return ''
	if (strength < 30) return 'bg-red-500'
	if (strength < 60) return 'bg-yellow-500'
	return 'bg-green-500'
}

function getStrengthLabel(strength: number): string {
	if (strength === 0) return 'Enter a password'
	if (strength < 30) return 'Weak password'
	if (strength < 60) return 'Moderate password'
	return 'Strong password'
}
