import { db } from '@/db'
import { users } from '@/db/schema'
import { changeUserRole } from '@/features/admin/components/actions/admin'
import { withAdminProtection } from '@/shared/components/admin-protection'

/**
 * User Management Page
 * Allows admins to view and manage user accounts
 */
async function UserManagement() {
	const allUsers = await db.select().from(users)

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-8">User Management</h1>

			<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
				<table className="w-full">
					<thead>
						<tr className="border-b border-white/10">
							<th className="p-4 text-left">Email</th>
							<th className="p-4 text-left">Role</th>
							<th className="p-4 text-left">Created</th>
							<th className="p-4 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{allUsers.map((user) => (
							<tr
								key={user.id}
								className="border-b border-white/5"
							>
								<td className="p-4">{user.email}</td>
								<td className="p-4">
									<span
										className={`px-2 py-1 rounded text-xs ${
											user.role === 'admin'
												? 'bg-purple-500/20 text-purple-300'
												: 'bg-emerald-500/20 text-emerald-300'
										}`}
									>
										{user.role}
									</span>
								</td>
								<td className="p-4">
									{new Date(
										user.createdAt
									).toLocaleDateString()}
								</td>
								<td className="p-4">
									<form
										action={async () => {
											'use server'
											await changeUserRole(
												user.id,
												user.role === 'admin'
													? 'user'
													: 'admin'
											)
										}}
									>
										<button className="text-sm text-neutral-400 hover:text-white">
											{user.role === 'admin'
												? 'Demote to User'
												: 'Promote to Admin'}
										</button>
									</form>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default async function ProtectedUserManagement() {
	return withAdminProtection(UserManagement, {})
}
