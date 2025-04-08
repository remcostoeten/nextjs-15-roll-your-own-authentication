'use client'

import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, AlertCircle } from 'lucide-react'

export type TActivity = {
	id: string
	type: string
	content: string
	metadata?: Record<string, any>
	createdAt: Date
	user: {
		id: string
		firstName: string
		lastName: string
		avatar: string | null
	}
}

type TProps = {
	activities: TActivity[]
}

export function WorkspaceActivityFeed({ activities }: TProps) {
	if (activities.length === 0) {
		return (
			<div className="text-center py-8">
				<AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
				<p className="mt-2 text-sm text-muted-foreground">
					No activity yet
				</p>
			</div>
		)
	}

	// Get user initials for avatar
	const getUserInitials = (firstName: string, lastName: string) => {
		return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
	}

	return (
		<div className="space-y-4">
			{activities.map((activity) => (
				<div
					key={activity.id}
					className="flex gap-3"
				>
					<Avatar className="h-8 w-8">
						{activity.user.avatar ? (
							<img
								src={activity.user.avatar || '/placeholder.svg'}
								alt={`${activity.user.firstName} ${activity.user.lastName}`}
							/>
						) : (
							<AvatarFallback>
								{getUserInitials(
									activity.user.firstName,
									activity.user.lastName
								)}
							</AvatarFallback>
						)}
					</Avatar>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<span className="font-medium">
								{activity.user.firstName}{' '}
								{activity.user.lastName}
							</span>
							<span className="text-xs text-muted-foreground">
								{formatDistanceToNow(
									new Date(activity.createdAt),
									{ addSuffix: true }
								)}
							</span>
							{activity.type === 'message' && (
								<MessageSquare className="h-3 w-3 text-muted-foreground" />
							)}
						</div>
						<div className="mt-1">
							<p className="text-sm">{activity.content}</p>
						</div>
						{activity.metadata &&
							activity.type === 'system' &&
							activity.metadata.memberName && (
								<div className="mt-1 text-xs text-muted-foreground">
									{activity.metadata.role && (
										<span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">
											{activity.metadata.role}
										</span>
									)}
								</div>
							)}
					</div>
				</div>
			))}
		</div>
	)
}
