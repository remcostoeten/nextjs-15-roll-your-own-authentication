'use server'

import { db } from '@/db'
import { sessions } from '@/db/schema'
import { getUser } from '@/shared/utilities/get-user'
import { eq } from 'drizzle-orm'
import { SessionDetails } from './session-details'

export async function AuthIndicator() {
	const user = await getUser()

	if (!user) {
		return (
			<div className="fixed z-50 bottom-4 right-4 p-4 bg-black/50 backdrop-blur-lg border border-white/10 rounded-xl text-sm text-neutral-400">
				Not authenticated
			</div>
		)
	}

	const userSessions = await db
		.select()
		.from(sessions)
		.where(eq(sessions.userId, user.userId))
		.orderBy(sessions.lastUsed)

	const lastSession = userSessions[0]
	const statusColor =
		user.role === 'admin' ? 'bg-purple-500' : 'bg-emerald-500'

	return (
		<SessionDetails 
			user={user}
			lastSession={lastSession}
			userSessions={userSessions}
			statusColor={statusColor}
		/>
	)
}
