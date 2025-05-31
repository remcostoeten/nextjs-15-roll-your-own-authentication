'use client';

import { formatDistanceToNow } from 'date-fns';
import { TNotificationWithActor } from '../types';
import { cn } from '@/shared/utilities';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { AlertCircle, Bell, CheckCircle, ExternalLink, Info, MessageSquare, Mail, AtSign, Users, FolderOpen, CheckSquare } from 'lucide-react';
import Link from 'next/link';

interface NotificationsListProps {
	notifications: TNotificationWithActor[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
	const getIcon = (type: string) => {
		switch (type) {
			case 'workspace_invite':
				return <Mail className="h-4 w-4 text-blue-500" />;
			case 'member_joined':
				return <Users className="h-4 w-4 text-green-500" />;
			case 'project_created':
				return <FolderOpen className="h-4 w-4 text-purple-500" />;
			case 'task_assigned':
				return <CheckSquare className="h-4 w-4 text-orange-500" />;
			case 'mention':
				return <AtSign className="h-4 w-4 text-blue-600" />;
			case 'comment':
				return <MessageSquare className="h-4 w-4 text-indigo-500" />;
			case 'file_shared':
				return <Info className="h-4 w-4 text-cyan-500" />;
			case 'system':
				return <AlertCircle className="h-4 w-4 text-red-500" />;
			default:
				return <Bell className="h-4 w-4 text-muted-foreground" />;
		}
	};

	return (
		<div className="divide-y divide-border">
			{notifications.map((notification) => (
				<div
					key={notification.id}
					className={cn(
						'p-4 hover:bg-muted/50 transition-colors',
						!notification.read && 'bg-primary/5'
					)}
				>
					<div className="flex items-start gap-3">
						<div className="mt-0.5">{getIcon(notification.type)}</div>
						<div className="flex-1 space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">{notification.title}</p>
								<div className="flex items-center gap-2">
									{!notification.read && (
										<Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
									)}
									<Badge variant="outline" className="text-xs">
										{notification.priority}
									</Badge>
								</div>
							</div>

							{/* Main message */}
							<p className="text-sm text-muted-foreground">{notification.message}</p>

							{/* Show actor email if available */}
							{(notification.actorEmail || notification.actor?.email) && (
								<div className="flex items-center gap-1 text-xs text-muted-foreground">
									<Mail className="h-3 w-3" />
									<span>From: {notification.actorEmail || notification.actor?.email}</span>
								</div>
							)}

							{/* Show custom message if available */}
							{notification.metadata?.customMessage && (
								<div className="p-2 bg-muted/50 rounded-md border-l-2 border-primary/50">
									<p className="text-xs text-muted-foreground mb-1">Personal message:</p>
									<p className="text-sm italic">"{notification.metadata.customMessage}"</p>
								</div>
							)}

							{/* Action button */}
							{notification.actionUrl && (
								<Link href={notification.actionUrl} passHref>
									<Button
										variant="link"
										size="sm"
										className="h-auto p-0 text-primary"
									>
										{notification.actionLabel || 'View details'}
										<ExternalLink className="ml-1 h-3 w-3" />
									</Button>
								</Link>
							)}

							{/* Timestamp and actor info */}
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>
									{formatDistanceToNow(new Date(notification.createdAt), {
										addSuffix: true,
									})}
								</span>
								{notification.actor && (
									<span className="flex items-center gap-1">
										<span>by {notification.actor.name}</span>
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
