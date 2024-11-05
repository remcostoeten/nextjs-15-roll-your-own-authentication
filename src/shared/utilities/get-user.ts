/**
 * Server-side user authentication utility for Next.js
 * @description This is the SSR (Server-Side Rendering) variant of the user authentication utility.
 * For client-side usage, see `use-user.ts` which implements React hooks and client-side state management.
 * @author @remcostoeten
 */

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { SessionUser } from '@/features/auth/types'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')

/**
 * Retrieves the authenticated user from JWT session cookie
 * @returns Promise<SessionUser | null> The authenticated user or null if not authenticated
 */
export async function getUser(): Promise<SessionUser | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get('session')?.value
	if (!token) return null

	try {
		const { payload } = await jwtVerify(token, secret)
		return payload as SessionUser
	} catch {
		return null
	}
}

/**
 * Example usage in a Server Component:
 *
 * ```tsx
 * // app/dashboard/page.tsx
 * export default async function DashboardPage() {
 *   const user = await getUser();
 *
 *   if (!user) {
 *     redirect('/login');
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {user.name}!</h1>
 *       {/* Rest of the dashboard component }
 *     </div>
 *   );
 * }
 */
