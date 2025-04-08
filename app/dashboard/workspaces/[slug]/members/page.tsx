import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
	getWorkspaceBySlug,
	getWorkspaceMembers,
} from '@/modules/workspaces/api/queries'
import { requireAuth } from '@/modules/authentication/utilities/auth'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { WorkspaceMembersList } from '@/modules/workspaces/components/workspace-members-list'
import { InviteMemberForm } from '@/modules/workspaces/components/invite-member-form'

type TProps = {
	params: {
		slug: string
	}
}

export default async function MembersPage({ params }: TProps) {
	const user = await requireAuth()
	const workspace = await getWorkspaceBySlug(params.slug)

	if (!workspace) {
		notFound()
	}

	const members = await getWorkspaceMembers(workspace.id)

	const canManageMembers =
		workspace.role === 'owner' || workspace.role === 'admin'

	return (
		<div className="container py-6">
			<div className="grid gap-6 md:grid-cols-3">
				<div className="md:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Workspace Members</CardTitle>
							<CardDescription>
								Manage members of the {workspace.name} workspace
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<div>Loading members...</div>}>
								<WorkspaceMembersList
									members={members}
									workspaceId={workspace.id}
									currentUserRole={workspace.role}
								/>
							</Suspense>
						</CardContent>
					</Card>
				</div>

				{canManageMembers && (
					<div>
						<Card>
							<CardHeader>
								<CardTitle>Invite Members</CardTitle>
								<CardDescription>
									Add new members to your workspace
								</CardDescription>
							</CardHeader>
							<CardContent>
								<InviteMemberForm workspaceId={workspace.id} />
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	)
}
