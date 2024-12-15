'use client'

import { motion } from 'framer-motion'
import { cn } from 'helpers'
import { PasswordStrength } from './types'
import { Check, X } from 'lucide-react'

interface GaugeProps {
	strength: PasswordStrength
	score: number
	password: string
	className?: string
}

const strengthColors: Record<PasswordStrength, string> = {
	'very-weak': 'bg-destructive/80 after:bg-destructive',
	weak: 'bg-orange-500/80 after:bg-orange-500',
	medium: 'bg-yellow-500/80 after:bg-yellow-500',
	strong: 'bg-emerald-500/80 after:bg-emerald-500',
	'very-strong': 'bg-primary/80 after:bg-primary'
}

const strengthWidth: Record<PasswordStrength, string> = {
	'very-weak': '20%',
	weak: '40%',
	medium: '60%',
	strong: '80%',
	'very-strong': '100%'
}

const requirements = [
	{ text: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
	{
		text: 'Contains uppercase letter',
		test: (pwd: string) => /[A-Z]/.test(pwd)
	},
	{
		text: 'Contains lowercase letter',
		test: (pwd: string) => /[a-z]/.test(pwd)
	},
	{ text: 'Contains number', test: (pwd: string) => /[0-9]/.test(pwd) },
	{
		text: 'Contains special character',
		test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd)
	}
]

export function PasswordStrengthGauge({
	strength,
	score,
	password,
	className
}: GaugeProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className={cn('w-full space-y-2', className)}
		>
			<div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: strengthWidth[strength] }}
					transition={{ duration: 0.4, ease: 'easeOut' }}
					className={cn(
						'h-full relative after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:blur-sm after:opacity-50',
						strengthColors[strength]
					)}
				/>
			</div>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.1 }}
				className="flex items-center justify-between"
			>
				<p className="text-xs font-medium text-muted-foreground capitalize">
					{strength.replace('-', ' ')}
				</p>
				<div className="flex gap-1">
					{[...Array(5)].map((_, i) => (
						<motion.div
							key={i}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.05 * i }}
							className={cn(
								'w-1.5 h-1.5 rounded-full',
								i < score
									? strengthColors[strength].split(' ')[0]
									: 'bg-muted'
							)}
						/>
					))}
				</div>
			</motion.div>
			<div className="space-y-2 mt-2">
				{requirements.map((req, i) => (
					<div key={i} className="flex items-center gap-2 text-sm">
						{req.test(password) ? (
							<Check className="h-4 w-4 text-green-500" />
						) : (
							<X className="h-4 w-4 text-destructive" />
						)}
						<span className="text-muted-foreground">
							{req.text}
						</span>
					</div>
				))}
			</div>
		</motion.div>
	)
}
