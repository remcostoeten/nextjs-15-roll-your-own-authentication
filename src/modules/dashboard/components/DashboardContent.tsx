import { use } from 'react'
import { getDashboardData } from '@/modules/dashboard/actions/dashboard.actions'
import { DashboardMetrics } from './DashboardMetrics'
import { DashboardMembers } from './DashboardMembers'

export function DashboardContent() {
  const data = use(getDashboardData())

  return (
    <div className="grid gap-6">
      <DashboardMetrics metrics={data.metrics} />
      <DashboardMembers members={data.members} />
    </div>
  )
} 