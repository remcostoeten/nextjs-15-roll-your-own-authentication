'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { asUUID } from '@/shared/types/common';
import { notificationService } from '../services/notification-service';

/**
 * Creates test notifications for the current user
 * This is useful for testing the notification system
 */
export async function createTestNotifications() {
  try {
    const session = await getSession();
    
    if (!session?.id) {
      throw new Error('User not authenticated');
    }

    const userId = asUUID(session.id);

    // Create various test notifications
    const testNotifications = [
      {
        userId,
        type: 'task_assigned' as const,
        title: 'New Task Assigned',
        message: 'You have been assigned a new task: "Complete notification system"',
        priority: 'medium' as const,
        actionUrl: '/dashboard/tasks/123',
        actionLabel: 'View Task',
      },
      {
        userId,
        type: 'project_updated' as const,
        title: 'Project Updated',
        message: 'The "Architecture RYOA" project has been updated with new requirements',
        priority: 'low' as const,
        actionUrl: '/dashboard/projects/456',
        actionLabel: 'View Project',
      },
      {
        userId,
        type: 'mention' as const,
        title: 'You were mentioned',
        message: 'John Doe mentioned you in a comment: "Great work on the notification system!"',
        priority: 'high' as const,
        actionUrl: '/dashboard/comments/789',
        actionLabel: 'View Comment',
      },
      {
        userId,
        type: 'system' as const,
        title: 'Welcome to the Platform!',
        message: 'Thank you for joining. Explore your dashboard to get started.',
        priority: 'medium' as const,
      },
      {
        userId,
        type: 'workspace_invite' as const,
        title: 'Workspace Invitation',
        message: 'You have been invited to join the "Development Team" workspace',
        priority: 'high' as const,
        actionUrl: '/dashboard/workspaces/invites',
        actionLabel: 'View Invitation',
      },
    ];

    // Create all test notifications
    const createdNotifications = await Promise.all(
      testNotifications.map(notification => 
        notificationService.createNotification(notification)
      )
    );

    return {
      success: true,
      message: `Created ${createdNotifications.length} test notifications`,
      notifications: createdNotifications,
    };
  } catch (error) {
    console.error('Error creating test notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create test notifications',
    };
  }
}
