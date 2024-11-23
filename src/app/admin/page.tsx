import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { getUser } from '@/services/auth/get-user'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import {
	AlertTriangleIcon,
	MailCheckIcon,
	ShieldCheckIcon,
	UsersIcon
} from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
	const user = await getUser()

	if (!user || user.role !== 'admin') {
		redirect('/login')
	}

	const allUsers = await db.select().from(users)

	// Calculate statistics
	const totalUsers = allUsers.length
	const verifiedUsers = allUsers.filter((user) => user.emailVerified).length
	const adminUsers = allUsers.filter((user) => user.role === 'admin').length
	const unverifiedUsers = totalUsers - verifiedUsers

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold tracking-tight">
					Admin Dashboard
				</h1>
				<Badge variant="outline" className="text-sm">
					Admin Access
				</Badge>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Users
						</CardTitle>
						<UsersIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalUsers}</div>
						<p className="text-xs text-muted-foreground">
							Registered accounts
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Verified Users
						</CardTitle>
						<MailCheckIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{verifiedUsers}
						</div>
						<p className="text-xs text-muted-foreground">
							{((verifiedUsers / totalUsers) * 100).toFixed(1)}%
							of total users
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Admin Users
						</CardTitle>
						<ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{adminUsers}</div>
						<p className="text-xs text-muted-foreground">
							With administrative access
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Verification
						</CardTitle>
						<AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{unverifiedUsers}
						</div>
						<p className="text-xs text-muted-foreground">
							Awaiting email verification
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Users Table */}
			<Card>
				<CardHeader>
					<h2 className="text-xl font-semibold mb-2">All Users</h2>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr>
									<th className="text-left py-2 px-4 border-b">
										ID
									</th>
									<th className="text-left py-2 px-4 border-b">
										Email
									</th>
									<th className="text-left py-2 px-4 border-b">
										Role
									</th>
									<th className="text-left py-2 px-4 border-b">
										Email Verified
									</th>
								</tr>
							</thead>
							<tbody>
								{allUsers.map((user) => (
									<tr key={user.id}>
										<td className="py-2 px-4 border-b">
											{user.id}
										</td>
										<td className="py-2 px-4 border-b">
											{user.email}
										</td>
										<td className="py-2 px-4 border-b">
											{user.role}
										</td>
										<td className="py-2 px-4 border-b">
											{user.emailVerified ? 'Yes' : 'No'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
