'use client'

import { useEffect, useState } from 'react'
import { getDashboardData } from '@/modules/dashboard/actions/dashboard.actions'
import { LoadingPage } from '@/components/ui/loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { DashboardMembers } from './dashboard-members'
import { DashboardMetrics } from './dashboard-metrics'

export function DashboardContent() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboardData>> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getDashboardData()
        setData(result)
      } catch (err) {
        console.error('Dashboard data fetch error:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No dashboard data available.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-6">
      <DashboardMetrics metrics={data.metrics} />
      <DashboardMembers members={data.members} />
    </div>
  )
} 