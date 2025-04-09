'use client'

import { motion } from 'framer-motion'
import { Logo } from '@/shared/components/logo'

interface AuthHeaderProps {
	title: string
	description: string
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
	return (
		<div className="flex flex-col items-center space-y-4 mb-8">
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.1 }}
			>
				<Logo className="h-10 w-auto" />
			</motion.div>

			<div className="text-center space-y-1">
				<motion.h1
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent"
				>
					{title}
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.3 }}
					className="text-sm text-muted-foreground"
				>
					{description}
				</motion.p>
			</div>
		</div>
	)
}
