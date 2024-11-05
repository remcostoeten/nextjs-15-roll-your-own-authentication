'use client'

import { useEffect, useState } from 'react'
import { getSession } from '@/features/auth/session'
import { SessionUser } from '@/features/auth/types'

/**
 * Custom hook to fetch and manage the current user's session data on the client side.
 * 
 * This hook is designed to be used only in client-side components. It uses React's
 * `useEffect` to fetch the session data when the component mounts and stores it in
 * local state. This hook also manages a loading state to indicate whether the session
 * data is still being fetched.
 * 
 * @returns {Object} An object containing the user session data and loading state.
 * @property {SessionUser | null} user - The current user's session data, or null if not authenticated.
 * @property {boolean} loading - A boolean indicating whether the session data is still being fetched.
 * 

 */
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

/*
 * @example
 * // Usage in a client-side component
 * 'use client';
 * import { useUser } from '@/shared/hooks/useUser';
 *
 * function DashboardPage() {
 *   const { user, loading } = useUser();
 *
 *   if (loading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (!user) {
 *     return <div>No user data available</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {user.email}</h1>
 *       <pre>
 *         <code>{JSON.stringify(user, null, 2)}</code>
 *       </pre>
 *     </div>
 *   );
 * }
 */
