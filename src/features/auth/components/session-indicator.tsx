'use client'

import { getFeatureConfig } from '@/core/config/FEATURE_CONFIG'
import { useEffect, useState } from 'react'
import { getCurrentSession } from '../actions/auth'
import { SessionUser } from '../types'

type SessionIndicatorProps = {
	onSessionChange?: (user: SessionUser | undefined) => void
}

export default function SessionIndicator({
	onSessionChange
}: SessionIndicatorProps) {
	const [user, setUser] = useState<SessionUser>()
	const config = getFeatureConfig(user?.role)

	const checkSession = async () => {
		const { isAuthenticated, user } = await getCurrentSession()
		setUser(isAuthenticated ? user : undefined)
		onSessionChange?.(isAuthenticated ? user : undefined)
	}

	useEffect(() => {
		checkSession()

		const handleAuthChange = () => {
			checkSession()
		}

		window.addEventListener('auth-change', handleAuthChange)
		return () => window.removeEventListener('auth-change', handleAuthChange)
	}, [])

	if (!config.showSessionIndicator.enabled || !user) return null

	return (
		<div className="flex items-center gap-2 text-sm">
			<span className="text-muted-foreground">Signed in as</span>
			<span className="font-medium">{user.email}</span>
			{user.role === 'admin' && (
				<span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
					Admin
				</span>
			)}
		</div>
	)
}
