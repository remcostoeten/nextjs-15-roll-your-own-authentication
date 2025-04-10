import { notFound } from 'next/navigation'
import { db } from '@/server/db'
import {
	workspaces,
	workspaceMembers,
	workspaceActivities,
} from '@/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'
import { WorkspaceHeader } from '@/components/workspaces/workspace-header'
import { WorkspaceTabs } from '@/components/workspaces/workspace-tabs'
import { WorkspaceActivityFeed } from '@/components/workspaces/workspace-activity-feed'

type TProps = {
	params: {
		slug: string
	}
}

export default async function WorkspaceView({ params }: TProps) {
	const user = await getCurrentUser()

	if (!user) {
		return null
	}

	const workspace = await db.query.workspaces.findFirst({
		where: eq(workspaces.slug, params.slug),
		with: {
			members: {
				with: {
					user: true,
				},
			},
			activities: {
				limit: 10,
				orderBy: (activities, { desc }) => [desc(activities.createdAt)],
				with: {
					user: true,
				},
			},
		},
	})

	if (!workspace) {
		notFound()
	}

	const membership = await db.query.workspaceMembers.findFirst({
		where: and(
			eq(workspaceMembers.workspaceId, workspace.id),
			eq(workspaceMembers.userId, user.id)
		),
	})

	if (!membership) {
		notFound()
	}

	return (
		<div className="flex flex-col h-full">
			<WorkspaceHeader
				workspace={workspace}
				role={membership.role}
			/>
			<div className="flex-1 container py-6">
				<WorkspaceTabs workspace={workspace} />
				<div className="mt-6">
					<WorkspaceActivityFeed activities={workspace.activities} />
				</div>
			</div>
		</div>
	)
}
