import { getAnalyticsMetrics } from '@/modules/rollyourownanalytics/server/queries/get-analytics-metrics'
import { getProject } from '@/modules/rollyourownanalytics/server/queries/get-project'
import { TAnalyticsFilter } from '@/modules/rollyourownanalytics/types'
import { Card, CardContent, CardDescription, Badge, CardHeader, CardTitle } from 'ui'
import { AnalyticsOverview } from './analytics-overview'

type TProps = {
  projectId: string
  filter?: TAnalyticsFilter
}

export async function AnalyticsDashboard({ projectId, filter = {} }: TProps) {
  const [project, metrics] = await Promise.all([
    getProject(projectId),
    getAnalyticsMetrics(projectId, filter),
  ])

  if (!project) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Project not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.domain}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={project.isActive ? 'default' : 'secondary'}>
            {project.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {metrics.realtimeVisitors > 0 && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {metrics.realtimeVisitors} Active
            </Badge>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <AnalyticsOverview metrics={metrics} />
      </div>
    </div>
  )
}
