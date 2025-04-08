import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
	getWorkspaceBySlug,
	getWorkspaceActivities,
	getWorkspaceStats,
} from '@/modules/workspaces/api/queries'
import { requireAuth } from '@/modules/authentication/utilities/auth'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { Briefcase, CheckSquare, Users, FileCode } from 'lucide-react'
import {
	TActivity,
	WorkspaceActivityFeed,
} from '@/modules/workspaces/components/workspace-activity-feed'
import { WorkspaceMessageForm } from '@/modules/workspaces/components/workspace-message-form'
import { WorkspaceStats } from '@/modules/workspaces/components/workspace-stats'

type TProps = {
	params: {
		slug: string
	}
}

export default async function WorkspacePage({ params }: TProps) {
	const user = await requireAuth()
	const workspace = await getWorkspaceBySlug(params.slug)

	if (!workspace) {
		notFound()
	}

	const activities = await getWorkspaceActivities(workspace.id)
	const stats = await getWorkspaceStats(workspace.id.toString())

	return (
		<div className="container py-6">
			<div className="grid gap-6 md:grid-cols-7">
				<div className="md:col-span-5 space-y-6">
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-2xl">
										{workspace.name}
									</CardTitle>
									<CardDescription className="mt-1">
										{workspace.description ||
											'No description provided'}
									</CardDescription>
								</div>
								{(workspace.role === 'owner' ||
									workspace.role === 'admin') && (
									<Button
										variant="outline"
										size="sm"
										asChild
									>
										<a
											href={`/dashboard/workspaces/${workspace.slug}/settings`}
										>
											Edit Workspace
										</a>
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex items-center text-sm text-muted-foreground">
								<div className="flex items-center mr-4">
									<Briefcase className="mr-1 h-4 w-4" />
									<span>
										Created{' '}
										{formatDistanceToNow(
											new Date(workspace.createdAt),
											{ addSuffix: true }
										)}
									</span>
								</div>
								<div className="flex items-center mr-4">
									<Users className="mr-1 h-4 w-4" />
									<span>{workspace.memberCount} members</span>
								</div>
								<div className="flex items-center">
									<CheckSquare className="mr-1 h-4 w-4" />
									<span>{workspace.taskCount} tasks</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Activity Feed</CardTitle>
						</CardHeader>
						<CardContent>
							<WorkspaceMessageForm workspaceId={workspace.id} />

							<div className="mt-6">
								<Suspense
									fallback={<div>Loading activities...</div>}
								>
									<WorkspaceActivityFeed
										activities={activities as TActivity[]}
									/>
								</Suspense>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="md:col-span-2 space-y-6">
					<Suspense fallback={<div>Loading stats...</div>}>
						<WorkspaceStats stats={stats as WorkspaceStats} />
					</Suspense>

					<Card>
						<CardHeader>
							<CardTitle>Quick Links</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Button
									variant="outline"
									className="w-full justify-start"
									asChild
								>
									<a
										href={`/dashboard/workspaces/${workspace.slug}/tasks`}
									>
										<CheckSquare className="mr-2 h-4 w-4" />
										View Tasks
									</a>
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start"
									asChild
								>
									<a
										href={`/dashboard/workspaces/${workspace.slug}/members`}
									>
										<Users className="mr-2 h-4 w-4" />
										Manage Members
									</a>
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start"
									asChild
								>
									<a
										href={`/dashboard/workspaces/${workspace.slug}/snippets`}
									>
										<FileCode className="mr-2 h-4 w-4" />
										Code Snippets
									</a>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
