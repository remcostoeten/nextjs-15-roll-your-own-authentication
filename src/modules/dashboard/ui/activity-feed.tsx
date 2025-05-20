'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Ticket } from 'lucide-react';
import Link from 'next/link';

interface ActivityFeedProps {
  items: Array<{
    id: string;
    type: 'note' | 'ticket';
    title: string;
    createdAt: Date;
    createdBy: string;
    avatar: string | null;
  }>;
  workspaceId: string;
}

export function ActivityFeed({ items, workspaceId }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <Avatar className="mt-1">
                <AvatarImage src={item.avatar || undefined} />
                <AvatarFallback>
                  {item.createdBy
                    ? item.createdBy
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : '??'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{item.createdBy || 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                  </p>
                </div>
                <Link
                  href={`/workspace/${workspaceId}/${item.type}s/${item.id}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.title}
                </Link>
              </div>
              {item.type === 'note' ? (
                <FileText className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Ticket className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
