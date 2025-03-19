'use client'

import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export function Header() {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full max-w-7xl mx-auto px-4 py-6 flex items-center justify-between"
		>
			<div className="flex items-center space-x-2">
				<span className="text-title-light text-xl font-bold">
					Colors
				</span>
				<span className="bg-button text-button text-xs px-2 py-0.5 rounded-full border border-button-border">
					Demo
				</span>
			</div>
			<Button
				variant="outline"
				size="sm"
				className="bg-button border-button-border text-button hover:bg-button hover:text-title-light"
			>
				<Github className="h-4 w-4 mr-2" />
				View Source
			</Button>
		</motion.div>
	)
}
