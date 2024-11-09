/**
 * @description This hook fetches the current user session and provides the user state and loading status.
 * @author Remco Stoeten
 */

'use client'

import { getSession } from '@/features/auth/session'
import type { SessionUser } from '@/features/auth/types'
import { useEffect, useState } from 'react'

export function useUser() {
	const [user, setUser] = useState<SessionUser | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchSession() {
			const session = await getSession()
			setUser(session)
			setLoading(false)
		}
		fetchSession()
	}, [])

	return { user, loading }
}
