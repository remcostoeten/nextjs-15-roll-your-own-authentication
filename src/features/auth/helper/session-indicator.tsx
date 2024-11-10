'use client'

import { type SessionUser } from '@/features/auth/types'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

type AuthIndicatorProps = {
	initialState?: {
		isAuthenticated: boolean
		user?: SessionUser | null
	}
}

export function AuthIndicator({
	initialState = { isAuthenticated: false, user: null }
}: AuthIndicatorProps) {
	const statusColor = initialState?.isAuthenticated
		? 'bg-emerald-500'
		: 'bg-red-500'
	const statusText = initialState?.isAuthenticated
		? 'Authenticated'
		: 'Not authenticated'

	return (
		<div className="fixed bottom-4 right-4 z-50">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center gap-2 p-2 pr-4 bg-black/50 backdrop-blur-lg border border-white/10 rounded-full"
			>
				<div className={`w-2 h-2 rounded-full ${statusColor}`} />
				<span className="text-sm text-neutral-400">{statusText}</span>
				{initialState?.user?.role === 'admin' && (
					<Shield className="w-4 h-4 text-purple-400" />
				)}
			</motion.div>
		</div>
	)
}
