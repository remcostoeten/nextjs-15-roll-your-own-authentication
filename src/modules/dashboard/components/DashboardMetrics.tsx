import { Card } from '@/components/ui/card'
import { Metric } from '@/modules/metrics/api/schemas/metric.schema'

interface DashboardMetricsProps {
  metrics: {
    totalUsers: number
    activeUsers: number
    totalPosts: number
    engagement: number
  }
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
          <p className="text-2xl font-bold">{metrics.totalUsers}</p>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
          <p className="text-2xl font-bold">{metrics.activeUsers}</p>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-muted-foreground">Total Posts</h3>
          <p className="text-2xl font-bold">{metrics.totalPosts}</p>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-muted-foreground">Engagement Rate</h3>
          <p className="text-2xl font-bold">{metrics.engagement}%</p>
        </div>
      </Card>
    </div>
  )
} 