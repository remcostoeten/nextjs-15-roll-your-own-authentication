import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui'

type TProps = {
  projectId: string
}

export function AnalyticsRealtime({ projectId }: TProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Realtime</CardTitle>
        <CardDescription>Live visitor activity and current sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          Realtime analytics coming soon...
        </div>
      </CardContent>
    </Card>
  )
}
