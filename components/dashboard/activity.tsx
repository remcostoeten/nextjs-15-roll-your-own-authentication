'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityItem } from '@/features/dashboard/types'
import { formatDistanceToNow } from 'date-fns'
import { cn } from 'helpers'
import { Activity } from 'lucide-react'

type ActivityFeedProps = {
  activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.type}</p>
                {activity.details?.message && (
                  <p className="text-sm text-muted-foreground">
                    {activity.details.message}
                  </p>
                )}
                {activity.details?.error && (
                  <p className="text-sm text-red-500">
                    {activity.details.error}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
              <div className={cn(
                'text-xs font-medium',
                {
                  'text-green-500': activity.status === 'success',
                  'text-red-500': activity.status === 'error',
                  'text-yellow-500': activity.status === 'pending'
                }
              )}>
                {activity.status}
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center text-sm text-muted-foreground">
              No recent activity
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 
