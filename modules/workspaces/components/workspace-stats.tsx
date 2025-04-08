import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckSquare, MessageSquare } from 'lucide-react'

export type WorkspaceStats = {
	memberCount: number
	taskCount: number
	todoTaskCount: number
	inProgressTaskCount: number
	doneTaskCount: number
	activityCount: number
}

type TProps = {
	stats: WorkspaceStats
}

export function WorkspaceStats({ stats }: TProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Workspace Stats</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center">
						<div className="mr-4">
							<Users className="h-5 w-5 text-muted-foreground" />
						</div>
						<div>
							<p className="text-sm font-medium">Members</p>
							<p className="text-2xl font-bold">
								{stats.memberCount}
							</p>
						</div>
					</div>

					<div className="flex items-center">
						<div className="mr-4">
							<CheckSquare className="h-5 w-5 text-muted-foreground" />
						</div>
						<div>
							<p className="text-sm font-medium">Total Tasks</p>
							<p className="text-2xl font-bold">
								{stats.taskCount}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-2">
						<div className="rounded-lg border p-2 text-center">
							<p className="text-xs text-muted-foreground">
								To Do
							</p>
							<p className="text-lg font-bold">
								{stats.todoTaskCount}
							</p>
						</div>
						<div className="rounded-lg border p-2 text-center">
							<p className="text-xs text-muted-foreground">
								In Progress
							</p>
							<p className="text-lg font-bold">
								{stats.inProgressTaskCount}
							</p>
						</div>
						<div className="rounded-lg border p-2 text-center">
							<p className="text-xs text-muted-foreground">
								Done
							</p>
							<p className="text-lg font-bold">
								{stats.doneTaskCount}
							</p>
						</div>
					</div>

					<div className="flex items-center">
						<div className="mr-4">
							<MessageSquare className="h-5 w-5 text-muted-foreground" />
						</div>
						<div>
							<p className="text-sm font-medium">Activities</p>
							<p className="text-2xl font-bold">
								{stats.activityCount}
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
