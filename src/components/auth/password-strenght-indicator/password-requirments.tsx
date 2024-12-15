import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { cn } from 'helpers'

import { PasswordRequirement } from './strenght'

interface RequirementListProps {
	password: string
	requirements: PasswordRequirement[]
	className?: string
}

export function PasswordRequirementList({
	password,
	requirements,
	className
}: RequirementListProps) {
	return (
		<motion.ul
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, delay: 0.1 }}
			className={cn('space-y-1.5', className)}
		>
			{requirements.map((requirement, index) => {
				const isMet = requirement.validator(password)
				return (
					<motion.li
						key={index}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.05 * index }}
						className={cn(
							'flex items-center space-x-2 text-xs transition-colors duration-200',
							isMet ? 'text-primary' : 'text-muted-foreground'
						)}
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.1 + 0.05 * index }}
						>
							{isMet ? (
								<Check className="w-3.5 h-3.5" />
							) : (
								<X className="w-3.5 h-3.5" />
							)}
						</motion.div>
						<span>{requirement.label}</span>
					</motion.li>
				)
			})}
		</motion.ul>
	)
}
