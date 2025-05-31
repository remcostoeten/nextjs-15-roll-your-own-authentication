'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import {
	AlertCircle,
	ArrowLeft,
	Bell,
	CheckCircle,
	Info,
	MessageSquare,
	Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useNotifications } from '../hooks/use-notifications';
import { TNotification } from '../types';

interface NotificationDetailProps {
	notification: TNotification;
	onBack: () => void;
}

export function NotificationDetail({ notification, onBack }: NotificationDetailProps) {
	const { markAsRead, archiveNotifications } = useNotifications({});

	useEffect(() => {
		if (!notification.read) {
			markAsRead([notification.id]);
		}
	}, [notification, markAsRead]);

	const getIcon = (type: string) => {
		switch (type) {
			case 'INFO':
				return <Info className="h-5 w-5 text-blue-400" />;
			case 'SUCCESS':
				return <CheckCircle className="h-5 w-5 text-emerald-400" />;
			case 'WARNING':
				return <AlertCircle className="h-5 w-5 text-amber-400" />;
			case 'ERROR':
				return <AlertCircle className="h-5 w-5 text-red-400" />;
			case 'MESSAGE':
				return <MessageSquare className="h-5 w-5 text-primary" />;
			default:
				return <Bell className="h-5 w-5 text-muted-foreground" />;
		}
	};

	const handleArchive = async () => {
		await archiveNotifications([notification.id]);
		onBack();
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center gap-2 pb-2">
				<div className="mr-2">{getIcon(notification.type)}</div>
				<CardTitle className="text-lg">{notification.title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground">
					{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
				</p>
				<div className="text-sm space-y-2">
					<p>{notification.message}</p>
					{notification.metadata && (
						<pre className="mt-4 p-3 bg-muted rounded-md text-xs overflow-auto">
							{JSON.stringify(notification.metadata, null, 2)}
						</pre>
					)}
				</div>
				{notification.actionUrl && (
					<div className="mt-4">
						<Link href={notification.actionUrl} passHref>
							<Button>{notification.actionLabel || 'View details'}</Button>
						</Link>
					</div>
				)}
			</CardContent>
			<CardFooter className="flex justify-between border-t pt-4">
				<Button variant="outline" size="sm" onClick={onBack}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
				<Button variant="destructive" size="sm" onClick={handleArchive}>
					<Trash2 className="mr-2 h-4 w-4" />
					Archive
				</Button>
			</CardFooter>
		</Card>
	);
}
