'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import Link from 'next/link';
import { NotificationsList } from './notifications-list';
import { NotificationsEmpty } from './notifications-empty';
import { useNotifications } from '../hooks/use-notifications';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utilities';

/**
 * Displays a notification bell icon with a dropdown popover showing recent notifications.
 *
 * The bell icon animates when new unread notifications arrive. When the dropdown is closed, any unread notifications are automatically marked as read. The dropdown includes a scrollable list of notifications or an empty state, and provides options to view all notifications or close the dropdown.
 *
 * @remark The unread badge displays "99+" if the unread count exceeds 99.
 */
export function NotificationsDropdown() {
	const [open, setOpen] = useState(false);
	const [isJiggling, setIsJiggling] = useState(false);
	const [prevUnreadCount, setPrevUnreadCount] = useState(0);
	const jiggleTimeoutRef = useRef<NodeJS.Timeout>();
	const { notifications, stats, markAsRead } = useNotifications();
	const unreadCount = stats?.unread || 0;

	// Jiggle animation when new notifications arrive
	useEffect(() => {
		if (unreadCount > prevUnreadCount && prevUnreadCount >= 0) {
			setIsJiggling(true);

			// Clear any existing timeout
			if (jiggleTimeoutRef.current) {
				clearTimeout(jiggleTimeoutRef.current);
			}

			// Stop jiggling after animation duration
			jiggleTimeoutRef.current = setTimeout(() => {
				setIsJiggling(false);
			}, 600); // Match the animation duration
		}
		setPrevUnreadCount(unreadCount);

		// Cleanup timeout on unmount
		return () => {
			if (jiggleTimeoutRef.current) {
				clearTimeout(jiggleTimeoutRef.current);
			}
		};
	}, [unreadCount, prevUnreadCount]);

	useEffect(() => {
		if (!open && unreadCount > 0 && notifications) {
			const unreadIds = notifications
				.filter(n => !n.read)
				.map(n => n.id);
			if (unreadIds.length > 0) {
				markAsRead(unreadIds);
			}
		}
	}, [open, unreadCount, notifications, markAsRead]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"relative transition-all duration-200 hover:bg-accent hover:scale-105",
						isJiggling && "animate-jiggle"
					)}
					title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
				>
					<Bell className={cn(
						"h-5 w-5 transition-all duration-200",
						unreadCount > 0 ? "text-primary drop-shadow-sm" : "text-muted-foreground",
						"hover:scale-110"
					)} />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className={cn(
								"absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold",
								"animate-pulse shadow-lg ring-2 ring-background",
								"transition-all duration-300 ease-out",
								isJiggling && "scale-110"
							)}
						>
							{unreadCount > 99 ? '99+' : unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-80 p-0 max-h-[70vh] overflow-hidden flex flex-col"
				align="end"
			>
				<div className="p-4 border-b border-border">
					<div className="flex items-center justify-between">
						<h3 className="font-medium">Notifications</h3>
						{unreadCount > 0 && (
							<Badge variant="secondary" className="text-xs">
								{unreadCount} unread
							</Badge>
						)}
					</div>
				</div>
				<div className="flex-1 overflow-y-auto">
					{notifications && notifications.length > 0 ? (
						<NotificationsList notifications={notifications} />
					) : (
						<NotificationsEmpty />
					)}
				</div>
				<div className="p-2 border-t border-border flex gap-2">
					<Button
						asChild
						variant="outline"
						size="sm"
						className="flex-1"
					>
						<Link href="/dashboard/notifications" onClick={() => setOpen(false)}>
							View All
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="flex-1 text-muted-foreground"
						onClick={() => setOpen(false)}
					>
						Close
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
