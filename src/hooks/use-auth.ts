'use client'

import {
	clearClientSession,
	validateClientSession
} from '@/features/auth/services/session-client.service'
import type { SessionUser } from '@/features/auth/types'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function useAuth() {
	const router = useRouter()
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [user, setUser] = useState<SessionUser | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		checkAuth()
	}, [])

	const checkAuth = useCallback(async () => {
		try {
			const session = await validateClientSession()
			setIsAuthenticated(!!session)
			setUser(session)
		} catch (error) {
			console.error('Auth check failed:', error)
			setIsAuthenticated(false)
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}, [])

	const signOut = useCallback(async () => {
		try {
			await clearClientSession()
			setIsAuthenticated(false)
			setUser(null)
			router.push('/sign-in')
		} catch (error) {
			console.error('Sign out failed:', error)
		}
	}, [router])

	return {
		isAuthenticated,
		isLoading,
		user,
		signOut,
		checkAuth
	}
}
