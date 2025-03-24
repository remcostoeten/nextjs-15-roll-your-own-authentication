import { Metadata } from 'next'
import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { auth } from '@/shared/auth'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/modules/authentication/components/logout-button'
import DashboardView from '@/views/dashboard'
import { dashboardMetadata } from '@/core/config/metadata/dashboard-metadata'

export const metadata: Metadata = dashboardMetadata

/**
 * Dashboard page
 * Follows the architecture by importing the view component
 * This file should contain minimal logic, focusing on server component setup and metadata
 */
export default async function DashboardPage() {
	const session = await auth()
	if (!session?.user) {
		redirect('/login?callbackUrl=/dashboard')
	}

	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, session.user.id),
	})

	if (!user) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600">Error</h1>
					<p className="mt-2 text-gray-600">
						User data not found. Please try logging in again.
					</p>
				</div>
			</div>
		)
	}

	const fields = [
		{ label: 'ID', value: user.id },
		{ label: 'Email', value: user.email },
		{ label: 'First Name', value: user.firstName || 'Not set' },
		{ label: 'Last Name', value: user.lastName || 'Not set' },
		{ label: 'Role', value: user.role },
		{ label: 'Location', value: user.location || 'Not set' },
		{ label: 'Timezone', value: user.timezone || 'Not set' },
		{
			label: 'Last Login',
			value: user.lastLogin
				? new Date(user.lastLogin).toLocaleString()
				: 'Never',
		},
		{ label: 'Login Streak', value: user.loginStreak || 0 },
		{ label: 'Account Status', value: user.accountStatus || 'active' },
		{ label: 'GitHub ID', value: user.githubId || 'Not connected' },
		{
			label: 'Created At',
			value: user.createdAt
				? new Date(Number(user.createdAt)).toLocaleString()
				: 'Unknown',
		},
		{
			label: 'Updated At',
			value: user.updatedAt
				? new Date(Number(user.updatedAt)).toLocaleString()
				: 'Unknown',
		},
	]

	return (
		<>
			<div className="container mx-auto p-6">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-3xl font-bold">Dashboardd</h1>
					<LogoutButton />
				</div>

				<div className="grid gap-6 md:grid-cols-[300px_1fr]">
					{/* Profile Section */}
					<div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
						<div className="text-center">
							<div className="mb-4">
								<img
									src={
										user.avatar ||
										`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
									}
									alt="Profile Avatar"
									className="mx-auto h-32 w-32 rounded-full"
								/>
							</div>
							<h2 className="text-xl font-semibold">
								{user.firstName} {user.lastName}
							</h2>
							<p className="text-sm text-gray-500">
								{user.email}
							</p>
							<p className="mt-1 text-xs text-gray-500">
								Role: {user.role}
							</p>
						</div>
					</div>

					{/* User Details Grid */}
					<div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
						<h2 className="mb-4 text-xl font-semibold">
							User Details
						</h2>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{fields.map(({ label, value }) => (
								<div
									key={label}
									className="rounded border p-4 dark:border-gray-700"
								>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{label}
									</div>
									<div className="mt-1 font-medium">
										{value}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<DashboardView />
		</>
	)
}
