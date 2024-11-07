'use client'

import { getSession } from '@/features/auth/session'
import { SessionUser } from '@/features/auth/types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function DashboardPage() {
	const [user, setUser] = useState<SessionUser | null>(null)
	function handleToast() {
		toast('Hello, world!')
	}
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
			<button onClick={handleToast}>Show toast</button>
			<h1>Welcome, {user.email}</h1>
			<pre>
				<code>{JSON.stringify(user, null, 2)}</code>
			</pre>
		</div>
	)
}
