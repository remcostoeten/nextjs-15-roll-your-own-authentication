import { notFound, redirect } from 'next/navigation'
import { getWorkspaceBySlug } from '@/modules/workspaces/api/queries'
import { requireAuth } from '@/modules/authentication/utilities/auth'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { WorkspaceSettingsForm } from '@/modules/workspaces/components/workspace-settings-form'

type TProps = {
	params: {
		slug: string
	}
}

export default async function SettingsPage({ params }: TProps) {
	const user = await requireAuth()
	const workspace = await getWorkspaceBySlug(params.slug)

	if (!workspace) {
		notFound()
	}

	// Only owners and admins can access settings
	if (workspace.role !== 'owner' && workspace.role !== 'admin') {
		redirect(`/dashboard/workspaces/${params.slug}`)
	}

	return (
		<div className="container py-6">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Workspace Settings</CardTitle>
						<CardDescription>
							Manage your workspace settings and preferences
						</CardDescription>
					</CardHeader>
					<CardContent>
						<WorkspaceSettingsForm workspace={workspace} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
