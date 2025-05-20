'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface TopContributorsProps {
  contributors: Array<{
    userId: string;
    name: string | null;
    avatar: string | null;
    count: number;
  }>;
}

export function TopContributors({ contributors }: TopContributorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contributors.map((contributor) => (
            <div key={contributor.userId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={contributor.avatar || undefined} />
                  <AvatarFallback>
                    {contributor.name
                      ? contributor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                      : '??'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{contributor.name || 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">
                    {contributor.count} {contributor.count === 1 ? 'contribution' : 'contributions'}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium">{contributor.count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
