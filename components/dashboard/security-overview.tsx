'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { UserData } from '@/features/authentication/types'
import { SecurityOverviewStats } from '@/features/dashboard/types'
import { cn } from 'helpers'
import { AlertTriangle, Key, MapPin, MonitorDot, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

type SecurityOverviewProps = {
  stats: SecurityOverviewStats
  user: UserData
  className?: string
}

export default function SecurityOverview({ stats, user, className }: SecurityOverviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Score</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className={cn('text-2xl font-bold', getScoreColor(stats.securityScore))}>
              {stats.securityScore}%
            </div>
            <Progress 
              value={stats.securityScore} 
              className={cn({
                'text-green-500': stats.securityScore >= 80,
                'text-yellow-500': stats.securityScore >= 60 && stats.securityScore < 80,
                'text-red-500': stats.securityScore < 60,
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className={cn(
              'text-2xl font-bold',
              stats.failedAttempts > 0 ? 'text-red-500' : 'text-green-500'
            )}>
              {stats.failedAttempts}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
          <MonitorDot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="text-2xl font-bold">{stats.activeDevices}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.lastLoginDevice && (
                <>Last: {stats.lastLoginDevice}</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Password Status</CardTitle>
          <Key className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="text-2xl font-bold">
              {stats.passwordLastChanged ? (
                new Date(stats.passwordLastChanged).toLocaleDateString()
              ) : 'Never changed'}
            </div>
            <p className="text-xs text-muted-foreground">
              Last password change
            </p>
          </div>
        </CardContent>
      </Card>

      {stats.lastLoginLocation && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">{stats.lastLoginLocation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
