'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactElement } from 'react'

type LoginButtonProps = {
	isLoading: boolean
}

/**
 * Animated login button component
 * @author Remco Stoeten
 */
export function LoginButton({ isLoading }: LoginButtonProps): ReactElement {
	return (
		<motion.button
			type="submit"
			disabled={isLoading}
			className="relative w-full py-3 text-[0.9375rem] font-semibold text-black bg-white rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden preserve-3d"
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<AnimatePresence mode="wait">
				{isLoading ? (
					<motion.div
						key="loading"
						initial={{ rotateX: -90 }}
						animate={{ rotateX: 0 }}
						exit={{ rotateX: 90 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="flex items-center justify-center gap-2"
					>
						<motion.div
							className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
							animate={{ rotate: 360 }}
							transition={{
								duration: 1,
								repeat: Infinity,
								ease: 'linear'
							}}
						/>
						<span>Signing in...</span>
					</motion.div>
				) : (
					<motion.span
						key="idle"
						initial={{ rotateX: -90 }}
						animate={{ rotateX: 0 }}
						exit={{ rotateX: 90 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
					>
						Sign In
					</motion.span>
				)}
			</AnimatePresence>
		</motion.button>
	)
}
