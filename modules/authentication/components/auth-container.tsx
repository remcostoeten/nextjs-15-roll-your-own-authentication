'use client'

import type React from 'react'

import { motion } from 'framer-motion'
import { Center } from '@/shared/components/Center'

type TProps = {
	children: React.ReactNode
}

export function AuthContainer({ children }: TProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
			className="w-full max-w-md mx-auto"
		>
			<div className="backdrop-blur-sm bg-[#0d0d0d]/90 border border-[#1a1d23]/40 shadow-xl rounded-md p-8">
				{children}
			</div>
		</motion.div>
	)
}
