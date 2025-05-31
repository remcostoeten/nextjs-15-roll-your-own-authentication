'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { NotificationsList } from '@/modules/notifications/components/notifications-list';
import { NotificationsEmpty } from '@/modules/notifications/components/notifications-empty';
import { useNotifications } from '@/modules/notifications/hooks/use-notifications';
import { TNotificationPriority, TNotificationType } from '@/modules/notifications/types';
import { CheckCheck, Archive, Search, Filter, Bell } from 'lucide-react';

export default function NotificationsPage() {
	const [activeTab, setActiveTab] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [typeFilter, setTypeFilter] = useState<TNotificationType | 'all'>('all');
	const [priorityFilter, setPriorityFilter] = useState<TNotificationPriority | 'all'>('all');

	// Get notifications based on active tab
	const getNotificationOptions = () => {
		const baseOptions = {
			limit: 50,
			types: typeFilter !== 'all' ? [typeFilter] : undefined,
		};

		switch (activeTab) {
			case 'unread':
				return { ...baseOptions, unreadOnly: true };
			case 'archived':
				return { ...baseOptions, includeArchived: true };
			default:
				return baseOptions;
		}
	};

	const {
		notifications,
		stats,
		isLoading,
		error,
		markAsRead,
		markAllAsRead,
		archiveNotifications,
	} = useNotifications(getNotificationOptions());

	// Filter notifications based on search and priority
	const filteredNotifications = notifications?.filter((notification) => {
		const matchesSearch = searchQuery === '' || 
			notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			notification.message.toLowerCase().includes(searchQuery.toLowerCase());
		
		const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
		
		return matchesSearch && matchesPriority;
	}) || [];

	const handleMarkAllAsRead = async () => {
		await markAllAsRead();
	};

	const handleArchiveAll = async () => {
		const unreadIds = filteredNotifications
			.filter(n => !n.read)
			.map(n => n.id);
		if (unreadIds.length > 0) {
			await archiveNotifications(unreadIds);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
					<p className="text-muted-foreground">
						Stay up to date with your workspace activity
					</p>
				</div>
				<div className="flex items-center gap-2">
					{stats && stats.unread > 0 && (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={handleMarkAllAsRead}
								className="gap-2"
							>
								<CheckCheck className="h-4 w-4" />
								Mark all read
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleArchiveAll}
								className="gap-2"
							>
								<Archive className="h-4 w-4" />
								Archive all
							</Button>
						</>
					)}
				</div>
			</div>

			{/* Stats Cards */}
			{stats && (
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total</CardTitle>
							<Bell className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.total}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Unread</CardTitle>
							<Badge variant="destructive" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
								{stats.unread}
							</Badge>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.unread}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">High Priority</CardTitle>
							<Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
								{stats.highPriority}
							</Badge>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.highPriority}</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Filters */}
			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search notifications..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full sm:w-80"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Filter className="h-4 w-4 text-muted-foreground" />
							<Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									<SelectItem value="workspace_invite">Workspace Invite</SelectItem>
									<SelectItem value="member_joined">Member Joined</SelectItem>
									<SelectItem value="project_created">Project Created</SelectItem>
									<SelectItem value="task_assigned">Task Assigned</SelectItem>
									<SelectItem value="mention">Mention</SelectItem>
									<SelectItem value="comment">Comment</SelectItem>
								</SelectContent>
							</Select>
							<Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as any)}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Priorities</SelectItem>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="urgent">Urgent</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Notifications Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">
						All
						{stats && <Badge variant="secondary" className="ml-2">{stats.total}</Badge>}
					</TabsTrigger>
					<TabsTrigger value="unread">
						Unread
						{stats && stats.unread > 0 && (
							<Badge variant="destructive" className="ml-2">{stats.unread}</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="archived">Archived</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="space-y-4">
					<Card>
						<CardContent className="p-0">
							{isLoading ? (
								<div className="flex items-center justify-center p-8">
									<div className="text-sm text-muted-foreground">Loading notifications...</div>
								</div>
							) : error ? (
								<div className="flex items-center justify-center p-8">
									<div className="text-sm text-destructive">{error}</div>
								</div>
							) : filteredNotifications.length > 0 ? (
								<NotificationsList notifications={filteredNotifications} />
							) : (
								<NotificationsEmpty />
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
