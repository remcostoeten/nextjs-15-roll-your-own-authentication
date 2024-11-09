'use client'

import { useFeatureConfig } from '@/hooks/use-feature-config'
import { useEffect, useState } from 'react'
import { useAuthState } from '../hooks/use-auth-state'
import type { SessionUser } from '../types'

// Types
type AuthState = {
	isAuthenticated: boolean
	user?: SessionUser
}

type AuthIndicatorProps = {
	initialState: AuthState
}

type RoleConfig = {
	bgColor: string
	textColor: string
	borderColor: string
	dotColor: string
	label: string
}

// Role configuration mapping
const ROLE_CONFIGS: Record<string, RoleConfig> = {
	admin: {
		bgColor: 'bg-violet-500/10',
		textColor: 'text-violet-400',
		borderColor: 'border-violet-500/20',
		dotColor: 'bg-violet-500',
		label: 'Admin'
	},
	user: {
		bgColor: 'bg-emerald-500/10',
		textColor: 'text-emerald-400',
		borderColor: 'border-emerald-500/20',
		dotColor: 'bg-emerald-500',
		label: 'User'
	},
	guest: {
		bgColor: 'bg-emerald-500/10',
		textColor: 'text-emerald-400',
		borderColor: 'border-emerald-500/20',
		dotColor: 'bg-emerald-500',
		label: 'Guest'
	}
} as const

export function AuthIndicatorClient({ initialState }: AuthIndicatorProps) {
	const [mounted, setMounted] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)
	const authState = useAuthState(initialState)
	const featureConfig = useFeatureConfig()

	useEffect(() => {
		setMounted(true)
	}, [])

	// Return null if the session indicator is disabled based on feature config
	if (!featureConfig.showSessionIndicator.enabled) {
		return null
	}

	const role = authState.user?.role ?? 'guest'
	const roleConfig = ROLE_CONFIGS[role] ?? ROLE_CONFIGS.guest
	const statusDotColor = !authState.isAuthenticated
		? 'bg-red-500'
		: roleConfig.dotColor

	return (
		<div
			className={`
        fixed z-50 bottom-4 right-4
        transition-all duration-300 ease-out
        ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
		>
			<div
				className={`
          relative
          flex items-start gap-3
          rounded-xl
          border border-neutral-800/50
          bg-black/90 backdrop-blur-md
          shadow-lg shadow-black/20
          transition-all duration-300 ease-out
          hover:border-neutral-700/50
          hover:shadow-xl
          ${isExpanded ? 'w-auto h-auto p-4' : 'w-8 h-8 p-2'}
        `}
				onMouseEnter={() => setIsExpanded(true)}
				onMouseLeave={() => setIsExpanded(false)}
			>
				{/* Status Dot */}
				<div
					className={`
            w-4 h-4 rounded-full flex-shrink-0
            ${statusDotColor}
            shadow-[0_0_8px] shadow-current/50
            transition-colors duration-300
            animate-pulse
          `}
				/>

				{/* Content Panel */}
				<div
					className={`
            flex flex-col gap-3 overflow-hidden whitespace-nowrap
            transition-all duration-300 ease-out
            ${isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}
          `}
				>
					{/* Status Text */}
					<div className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-neutral-200">
							{authState.isAuthenticated
								? 'Authenticated'
								: 'Not authenticated'}
						</span>

						{authState.user && (
							<div className="space-y-2">
								{/* Role Badge */}
								<div
									className={`
                    inline-flex items-center
                    px-2.5 py-0.5
                    text-xs font-semibold
                    rounded-full border
                    ${roleConfig.bgColor}
                    ${roleConfig.textColor}
                    ${roleConfig.borderColor}
                  `}
								>
									{roleConfig.label}
								</div>

								{/* User Info */}
								<div className="space-y-1">
									<p className="text-sm text-neutral-400 font-medium">
										{authState.user.email}
									</p>
									<p className="text-xs font-mono text-neutral-500">
										ID: {authState.user.userId.slice(0, 8)}
										...
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

// Optional: Add component for server-side rendering
export function AuthIndicator(props: AuthIndicatorProps) {
	return <AuthIndicatorClient {...props} />
}
