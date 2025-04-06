import type React from 'react'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'

export async function UserProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const user = await getCurrentUser()

	return (
		<>
			{/* Pass user data to client via a script tag */}
			{user && (
				<script
					dangerouslySetInnerHTML={{
						__html: `window.__user = ${JSON.stringify({
							id: user.id,
							email: user.email,
							username: user.email.split('@')[0], // Fallback if username isn't in the token
							firstName: user.email.split('@')[0], // Fallback if firstName isn't in the token
							lastName: '', // Fallback if lastName isn't in the token
							isAdmin: user.isAdmin,
						})};`,
					}}
				/>
			)}
			{children}
		</>
	)
}
