'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getUserMutation } from '../../mutations/user'

type User = {
	id: number
	email: string
	role: string
} | null

export default function SessionStatus({ user }: { user: User }) {
	const [isHovered, setIsHovered] = useState(false)
	const [currentUser, setCurrentUser] = useState<User | null>(user)

	useEffect(() => {
		const fetchUser = async () => {
			const result = await getUserMutation()
			if (result.success) {
				setCurrentUser(result.user ? result.user : null)
			}
		}
		fetchUser()
	}, [])

	const pulseVariants = {
		initial: { scale: 1, opacity: 0.5 },
		animate: {
			scale: [1, 1.5, 1],
			opacity: [0.5, 1, 0.5],
			boxShadow: [
				'0 0 0 0 rgba(52, 211, 153, 0.2)',
				'0 0 0 10px rgba(52, 211, 153, 0)',
				'0 0 0 0 rgba(52, 211, 153, 0)'
			]
		}
	}

	function Dot() {
		return (
			<motion.div
				className={`w-1 h-1 rounded-full relative z-10 ${
					currentUser
						? 'bg-green-500 shadow-[0_0_10px_rgba(52,211,153,0.7)]'
						: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]'
				}`}
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.7, 1, 0.7]
				}}
				transition={{
					duration: 1.5,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
			/>
		)
	}

	return (
		<div
			className="fixed bottom-2 right-4 z-50"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="relative">
				{/* Background pulse effect */}
				<motion.div
					className={`absolute inset-0 rounded-full ${
						currentUser ? 'bg-green-500' : 'bg-red-500'
					}`}
					initial="initial"
					animate="animate"
					variants={pulseVariants}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: 'easeInOut'
					}}
				/>
				<Dot />
			</div>

			<AnimatePresence>
				{isHovered && currentUser && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						className="absolute bottom-6 right-0 bg-gray-800/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg min-w-[200px]"
					>
						<div className="space-y-1">
							<p className="text-sm">
								<span className="text-gray-400">Email:</span>{' '}
								{currentUser.email}
							</p>
							<p className="text-sm">
								<span className="text-gray-400">ID:</span>{' '}
								{currentUser.id}
							</p>
							<p className="text-sm">
								<span className="text-gray-400">Role:</span>{' '}
								{currentUser.role}
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
