'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from 'helpers'
import { Activity } from 'lucide-react'
type ActivityFeedProps = {
	activities: Array<{
		type: string
		timestamp: string
		details?: { message?: string }
		status: string
	}>
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Activity className="h-5 w-5" />
					Recent Activity
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{activities?.map((activity, index) => (
						<div key={index} className="flex items-start gap-3">
							<div className="p-2 bg-muted rounded">
								<Activity className="h-4 w-4 text-muted-foreground" />
							</div>
							<div>
								<p className="font-medium">{activity.type}</p>
								<p className="text-sm text-muted-foreground">
									{formatDate(activity.timestamp, 'relative')}
								</p>
								{activity.details?.message && (
									<p className="text-sm text-muted-foreground">
										{activity.details.message}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
