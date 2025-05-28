import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/auth-options';
import { NotificationService } from '@/modules/notifications/server/services/notification-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await NotificationService.getNotificationStats(session.user.id);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification stats' },
      { status: 500 }
    );
  }
}
