'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to manage authentication state.
 *
 * @returns An object containing two properties: isAuthenticated and isLoading.
 * isAuthenticated is a boolean indicating if the user is authenticated.
 * isLoading is a boolean indicating if the authentication check is in progress.
 */
export function useAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/check')
				setIsAuthenticated(response.ok)
			} catch {
				setIsAuthenticated(false)
			} finally {
				setIsLoading(false)
			}
		}

		checkAuth()
	}, [])

	return { isAuthenticated, isLoading }
}
