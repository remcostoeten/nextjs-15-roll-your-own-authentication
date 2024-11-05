'use client'

import { useEffect, useState } from 'react'
import { SessionUser } from '../types'
import { getAuthState } from './get-auth-state'

interface AuthState {
	isAuthenticated: boolean
	user?: SessionUser
}

interface AuthIndicatorProps {
	initialState: AuthState
}

export function AuthIndicatorClient({ initialState }: AuthIndicatorProps) {
	const [isHovered, setIsHovered] = useState(false)
	const [authState, setAuthState] = useState<AuthState>(initialState)

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const state = await getAuthState()
				setAuthState(state)
			} catch {
				setAuthState({ isAuthenticated: false })
			}
		}

		// Set up periodic checks
		const interval = setInterval(checkAuth, 60000) // Check every minute

		return () => clearInterval(interval)
	}, [])

	return (
		<div
			className="fixed bottom-4 right-4 z-50 group"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className={`
          flex items-center
          ${!isHovered ? 'w-3 h-3' : 'h-6 px-3'}
          rounded-full 
          ${
				authState.isAuthenticated
					? authState.user?.role === 'admin'
						? 'bg-purple-500'
						: 'bg-green-500'
					: 'bg-red-500'
			}
          ${!isHovered && 'animate-pulse'}
          transition-all duration-300
          shadow-lg
          cursor-pointer
        `}
			>
				<span
					className={`
            whitespace-nowrap text-xs font-medium text-white
            ${isHovered ? 'opacity-100 ml-1' : 'opacity-0 w-0'}
            transition-all duration-300
          `}
				>
					{authState.isAuthenticated
						? `${authState.user?.role === 'admin' ? 'Admin: ' : ''}${authState.user?.email}`
						: 'Not signed in'}
				</span>
			</div>
		</div>
	)
}
