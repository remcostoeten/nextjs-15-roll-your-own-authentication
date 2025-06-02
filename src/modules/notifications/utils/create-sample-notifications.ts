'use server';

import { createNotification } from '../server/mutations/create-notification';
import { TNotificationType, TNotificationPriority } from '../types';

/**
 * Creates a set of predefined sample notifications for demonstration or testing purposes.
 *
 * Iterates through a list of sample notification objects and attempts to create each one using the notification creation mutation. Returns an array containing the result of each creation attempt, with error objects included for any failures.
 *
 * @returns An array of results for each sample notification creation, where each element is either a successful response or an error object indicating failure.
 */
export async function createSampleNotifications() {
	const sampleNotifications = [
		{
			type: 'workspace_invite' as TNotificationType,
			title: 'Welcome to the team!',
			message: 'You have been invited to join the Development workspace by john.doe@company.com\n\nPersonal message: "Welcome aboard! We\'re excited to have you join our development team. Looking forward to working with you!"',
			priority: 'high' as TNotificationPriority,
			actionUrl: '/dashboard/workspaces',
			actionLabel: 'View Workspace',
			actorEmail: 'john.doe@company.com',
			metadata: {
				customMessage: "Welcome aboard! We're excited to have you join our development team. Looking forward to working with you!",
				inviterEmail: 'john.doe@company.com'
			}
		},
		{
			type: 'task_assigned' as TNotificationType,
			title: 'New task assigned',
			message: 'You have been assigned to work on "Implement user authentication" in the Backend project.',
			priority: 'medium' as TNotificationPriority,
			actionUrl: '/dashboard/tasks',
			actionLabel: 'View Task',
			actorEmail: 'sarah.wilson@company.com',
		},
		{
			type: 'project_created' as TNotificationType,
			title: 'New project created',
			message: 'A new project "Mobile App Redesign" has been created in your workspace.',
			priority: 'low' as TNotificationPriority,
			actionUrl: '/dashboard/projects',
			actionLabel: 'View Project',
		},
		{
			type: 'mention' as TNotificationType,
			title: 'You were mentioned',
			message: 'John Doe mentioned you in a comment: "Hey @you, can you review this code?"',
			priority: 'high' as TNotificationPriority,
			actionUrl: '/dashboard/comments',
			actionLabel: 'View Comment',
			actorEmail: 'john.doe@company.com',
		},
		{
			type: 'member_joined' as TNotificationType,
			title: 'New team member',
			message: 'Sarah Wilson has joined your workspace as a developer.',
			priority: 'low' as TNotificationPriority,
			actionUrl: '/dashboard/members',
			actionLabel: 'View Members',
		},
		{
			type: 'comment' as TNotificationType,
			title: 'New comment on your task',
			message: 'Mike Johnson commented on "Fix login bug": "I think we should also check the session timeout."',
			priority: 'medium' as TNotificationPriority,
			actionUrl: '/dashboard/tasks',
			actionLabel: 'View Task',
		},
		{
			type: 'system' as TNotificationType,
			title: 'System maintenance scheduled',
			message: 'Scheduled maintenance will occur on Sunday at 2 AM UTC. Expected downtime: 30 minutes.',
			priority: 'urgent' as TNotificationPriority,
			actionUrl: '/dashboard/system',
			actionLabel: 'Learn More',
		},
		{
			type: 'file_shared' as TNotificationType,
			title: 'File shared with you',
			message: 'Alex shared "Design Mockups v2.figma" with you in the Design project.',
			priority: 'medium' as TNotificationPriority,
			actionUrl: '/dashboard/files',
			actionLabel: 'View File',
		},
	];

	const results: any[] = [];
	
	for (const notification of sampleNotifications) {
		try {
			const result = await createNotification(notification);
			results.push(result);
		} catch (error) {
			console.error('Error creating sample notification:', error);
			results.push({ success: false, error: 'Failed to create notification' });
		}
	}

	return results;
}
