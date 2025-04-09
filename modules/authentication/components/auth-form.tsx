'use client'

import type React from 'react'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type TProps = {
	children: React.ReactNode
	action: (formData: FormData) => Promise<void> | void
}

export function AuthForm({ children, action }: TProps) {
	const formRef = useRef<HTMLFormElement>(null)

	return (
		<form
			ref={formRef}
			action={action}
			className="space-y-6"
		>
			<AnimatePresence mode="wait">
				<motion.div
					key="form-content"
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -5 }}
					transition={{ duration: 0.3 }}
				>
					{children}
				</motion.div>
			</AnimatePresence>
		</form>
	)
}
