'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { NotificationsList } from './notifications-list';
import { NotificationsEmpty } from './notifications-empty';
import { useNotifications } from '../hooks/use-notifications';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utilities';

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const { notifications, stats, markAsRead } = useNotifications();
  const unreadCount = stats?.unreadCount || 0;

  useEffect(() => {
    if (!open && unreadCount > 0) {
      markAsRead();
    }
  }, [open, unreadCount, markAsRead]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 max-h-[70vh] overflow-hidden flex flex-col" 
        align="end"
      >
        <div className="p-4 border-b border-border">
          <h3 className="font-medium">Notifications</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifications && notifications.length > 0 ? (
            <NotificationsList notifications={notifications} />
          ) : (
            <NotificationsEmpty />
          )}
        </div>
        <div className="p-2 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}