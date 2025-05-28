import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/auth-options';
import { NotificationService } from '@/modules/notifications/server/services/notification-service';
import { z } from 'zod';

const getNotificationsSchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  offset: z.string().optional().transform(val => val ? parseInt(val) : 0),
  unreadOnly: z.string().optional().transform(val => val === 'true'),
  types: z.string().optional().transform(val => val ? val.split(',') : undefined),
  includeArchived: z.string().optional().transform(val => val === 'true'),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = getNotificationsSchema.parse(Object.fromEntries(searchParams));

    const notifications = await NotificationService.getUserNotifications(
      session.user.id,
      params
    );

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

const createNotificationSchema = z.object({
  type: z.enum([
    'workspace_invite',
    'member_joined',
    'member_left',
    'project_created',
    'project_updated',
    'task_assigned',
    'task_completed',
    'mention',
    'comment',
    'file_shared',
    'system'
  ]),
  title: z.string().min(1),
  message: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  actorId: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createNotificationSchema.parse(body);

    const notification = await NotificationService.createNotification({
      userId: session.user.id,
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
