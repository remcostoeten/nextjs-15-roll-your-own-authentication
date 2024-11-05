'use client'

import { useEffect, useState } from 'react'
import { getSession } from '@/features/auth/session'
import { SessionUser } from '@/features/auth/types'

export default function DashboardPage() {
	const [user, setUser] = useState<SessionUser | null>(null)

	useEffect(() => {
		async function fetchSession() {
			const session = await getSession()
			setUser(session)
		}
		fetchSession()
	}, [])

	if (!user) {
		return <div>Loading...</div>
	}

	return (
		<div>
			<h1>Welcome, {user.email}</h1>
			<pre>
				<code>{JSON.stringify(user, null, 2)}</code>
			</pre>
		</div>
	)
}
