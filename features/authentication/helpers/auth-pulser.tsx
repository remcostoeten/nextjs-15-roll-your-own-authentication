'use client'

import { getUserData } from '@/app/server/queries'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from 'helpers'
import { useEffect, useState } from 'react'

type User = {
	id: number
	email: string
} | null

export default function AuthPulser() {
	const [user, setUser] = useState<User>(null)
	const [isHovered, setIsHovered] = useState(false)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getUserData()
				setUser(userData)
			} catch (error) {
				console.error('Error fetching user data:', error)
				setUser(null)
			}
		}

		fetchUser()
	}, [])

	return (
		<div
			className="fixed bottom-4 right-4 z-50"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<motion.div
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.7, 1, 0.7]
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
				className={cn(
					'w-4 h-4 rounded-full',
					user ? 'bg-green-500' : 'bg-red-500',
					'shadow-[0_0_15px] transition-colors duration-300',
					user ? 'shadow-green-500/50' : 'shadow-red-500/50'
				)}
			/>

			<AnimatePresence>
				{isHovered && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.9 }}
						transition={{ duration: 0.2 }}
						className={cn(
							'absolute bottom-full right-0 mb-2',
							'bg-black/80 backdrop-blur-sm',
							'rounded-lg p-3 min-w-[200px]',
							'text-white text-sm',
							'shadow-lg'
						)}
					>
						<div className="space-y-1">
							{user ? (
								<>
									<p className="font-medium text-green-400">
										Authenticated
									</p>
									<p className="text-gray-300 text-xs">
										ID: {user.id}
									</p>
									<p className="text-gray-300 text-xs truncate">
										{user.email}
									</p>
								</>
							) : (
								<p className="font-medium text-red-400">
									Not Authenticated
								</p>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
