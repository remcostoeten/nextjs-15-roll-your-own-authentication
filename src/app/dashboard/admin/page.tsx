'use server'

import { db } from '@/server/db'
import { User } from '@/server/db/schemas/users'
import { UserMetrics } from '@/server/db/schemas/user-metrics'
import { AdminBanner } from '@/views/admin'
import { UserTable } from '@/views/admin/user-table'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAccessToken } from '@/shared/utils/jwt/jwt'
import { eq } from 'drizzle-orm'
import { users } from '@/server/db/schemas'

async function pairUserWithMetrics(user: User, metrics: UserMetrics[]) {
	return {
		...user,
		...metrics.find((metric) => metric.userId === user.id),
	}
}

// Server-side check for admin access
async function checkAdminAccess() {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value

	if (!accessToken) {
		redirect('/login?callbackUrl=/admin')
	}

	try {
		const payload = await verifyAccessToken(accessToken)
		const user = await db.query.users.findFirst({
			where: eq(users.id, payload.sub),
		})

		if (user?.role !== 'admin') {
			redirect('/dashboard')
		}
	} catch (error) {
		redirect('/login?callbackUrl=/admin')
	}
}

export default async function AdminPage() {
	// Check admin access before rendering the page
	await checkAdminAccess()

	const userList: User[] = await db.query.users.findMany()
	const userMetricsList: UserMetrics[] = await db.query.userMetrics.findMany()

	const userListWithMetrics = await Promise.all(
		userList.map((user) => pairUserWithMetrics(user, userMetricsList))
	)

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-6">
			<AdminBanner />
			<h1 className="text-3xl font-bold text-white mb-8">
				Admin Dashboard
			</h1>
			<div className="w-full max-w-7xl">
				<UserTable users={userListWithMetrics} />
			</div>
		</div>
	)
}
