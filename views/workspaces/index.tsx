import { Button } from 'ui'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/server/db'
import { workspaces, workspaceMembers } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'
import { WorkspaceCard } from '@/components/workspaces/workspace-card'

export default async function WorkspacesView() {
	const user = await getCurrentUser()

	if (!user) {
		return null
	}

	const userWorkspaces = await db.query.workspaceMembers.findMany({
		where: eq(workspaceMembers.userId, user.id),
		with: {
			workspace: true,
		},
	})

	return (
		<div className="container py-6">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold">Workspaces</h1>
					<p className="text-muted-foreground mt-1">
						Manage your workspaces and collaborate with others
					</p>
				</div>
				<Link href="/dashboard/workspaces/create">
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						Create Workspace
					</Button>
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{userWorkspaces.map((membership) => (
					<WorkspaceCard
						key={membership.workspace.id}
						workspace={membership.workspace}
						role={membership.role}
					/>
				))}
			</div>
		</div>
	)
}
