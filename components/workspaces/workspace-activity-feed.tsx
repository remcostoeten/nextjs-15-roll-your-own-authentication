import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type workspaceActivities } from '@/server/db/schema'
import { formatDistanceToNow } from 'date-fns'

interface WorkspaceActivityFeedProps {
	activities: (typeof workspaceActivities.$inferSelect & {
		user: {
			name: string | null
			email: string
		}
	})[]
}

export function WorkspaceActivityFeed({
	activities,
}: WorkspaceActivityFeedProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{activities.map((activity) => (
						<div
							key={activity.id}
							className="flex items-start gap-4 text-sm"
						>
							<div className="flex-1 space-y-1">
								<p>
									<span className="font-medium">
										{activity.user.name ||
											activity.user.email}
									</span>{' '}
									{activity.content}
								</p>
								<p className="text-xs text-muted-foreground">
									{formatDistanceToNow(
										new Date(activity.createdAt),
										{ addSuffix: true }
									)}
								</p>
							</div>
						</div>
					))}
					{activities.length === 0 && (
						<p className="text-sm text-muted-foreground">
							No recent activity
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
