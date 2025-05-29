'use client';

import { formatDistanceToNow } from 'date-fns';
import { TNotification } from '../types';
import { cn } from '@/shared/utilities';
import { Button } from '@/shared/components/ui/button';
import { 
  AlertCircle, 
  Bell, 
  CheckCircle, 
  ExternalLink, 
  Info, 
  MessageSquare 
} from 'lucide-react';
import Link from 'next/link';

interface NotificationsListProps {
  notifications: TNotification[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'INFO':
        return <Info className="h-4 w-4 text-blue-400" />;
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'WARNING':
        return <AlertCircle className="h-4 w-4 text-amber-400" />;
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'MESSAGE':
        return <MessageSquare className="h-4 w-4 text-primary" />;
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
            "p-4 hover:bg-muted/50 transition-colors",
            !notification.read && "bg-primary/5"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
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
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}