import { TAnalyticsFilter } from '@/modules/rollyourownanalytics/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui'

type TProps = {
  projectId: string
  filter?: TAnalyticsFilter
}

export function AnalyticsEvents({ projectId, filter }: TProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <CardDescription>Custom events and user interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          Events analytics coming soon...
        </div>
      </CardContent>
    </Card>
  )
}
