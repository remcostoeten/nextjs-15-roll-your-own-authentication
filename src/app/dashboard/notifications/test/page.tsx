'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { createSampleNotifications } from '@/modules/notifications/utils/create-sample-notifications';
import { toast } from '@/shared/components/toast';

/**
 * React page component for testing the notification system by creating sample notifications.
 *
 * Renders a UI that allows users to generate multiple sample notifications of various types and priorities, displaying feedback on the creation process and listing the notification types available for testing.
 */
export default function NotificationsTestPage() {
	const [isCreating, setIsCreating] = useState(false);

	const handleCreateSampleNotifications = async () => {
		setIsCreating(true);
		try {
			const results = await createSampleNotifications();
			const successCount = results.filter(r => r.success).length;
			const failCount = results.filter(r => !r.success).length;
			
			if (successCount > 0) {
				toast.success(`Created ${successCount} sample notifications successfully!`);
			}
			if (failCount > 0) {
				toast.error(`Failed to create ${failCount} notifications.`);
			}
		} catch (error) {
			console.error('Error creating sample notifications:', error);
			toast.error('Failed to create sample notifications');
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Notifications Test</h1>
				<p className="text-muted-foreground">
					Test the notification system by creating sample notifications
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Create Sample Notifications</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							This will create 8 sample notifications of different types and priorities to test the notification system.
							Watch the bell icon in the header - it will jiggle when new notifications arrive!
						</p>
						<div className="flex gap-2">
							<Button
								onClick={handleCreateSampleNotifications}
								disabled={isCreating}
							>
								{isCreating ? 'Creating...' : 'Create Sample Notifications'}
							</Button>
						</div>
						<div className="p-3 bg-muted rounded-md text-sm">
							<strong>💡 Tip:</strong> After creating notifications, check the bell icon in the top-right corner of the dashboard header.
							It will show a red badge with the count and jiggle when new notifications arrive!
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Sample Notification Types</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-2 text-sm">
						<div className="flex justify-between">
							<span>Workspace Invite</span>
							<span className="text-red-500">High Priority</span>
						</div>
						<div className="flex justify-between">
							<span>Task Assigned</span>
							<span className="text-yellow-500">Medium Priority</span>
						</div>
						<div className="flex justify-between">
							<span>Project Created</span>
							<span className="text-green-500">Low Priority</span>
						</div>
						<div className="flex justify-between">
							<span>Mention</span>
							<span className="text-red-500">High Priority</span>
						</div>
						<div className="flex justify-between">
							<span>Member Joined</span>
							<span className="text-green-500">Low Priority</span>
						</div>
						<div className="flex justify-between">
							<span>Comment</span>
							<span className="text-yellow-500">Medium Priority</span>
						</div>
						<div className="flex justify-between">
							<span>System Maintenance</span>
							<span className="text-red-600">Urgent Priority</span>
						</div>
						<div className="flex justify-between">
							<span>File Shared</span>
							<span className="text-yellow-500">Medium Priority</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
