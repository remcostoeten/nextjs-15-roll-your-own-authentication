// ... other imports stay the same

import { ActivityFeed } from "@/components/dashboard/activity"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import SecurityOverview from "@/components/dashboard/security-overview"
import { calculateSecurityScore } from "@/features/dashboard/security"
import { SecurityOverviewStats } from "@/features/dashboard/types"
import { redirect } from "next/navigation"
import { getUserData } from "../server/queries"

type DeviceInfo = {
  id: string
  browser: string
  os: string
  deviceType: string
  isMobile: boolean
  lastActive: string
  location: string | undefined
  isCurrent: boolean
}

export default async function DashboardPage() {
  const user = await getUserData()

  if (!user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const securityStats: SecurityOverviewStats = {
    totalLogins: user.recentActivity.filter(a => a.type === 'login' && a.status === 'success').length,
    failedAttempts: user.recentActivity.filter(a => a.status === 'error').length,
    lastLoginLocation: user.lastLocation?.city || undefined,
    lastLoginDevice: user.lastDevice?.browser || undefined,
    passwordLastChanged: user.passwordChangedAt?.toISOString() || '',
    securityScore: calculateSecurityScore(user),
    activeDevices: user.sessions.length,
    devices: user.sessions.map(session => ({
      id: session.id,
      browser: session.deviceInfo.browser || '',
      os: session.deviceInfo.os || '',
      deviceType: session.deviceInfo.isMobile ? 'mobile' : 'desktop',
      isMobile: session.deviceInfo.isMobile,
      lastActive: session.lastActive.toISOString(),
      location: session.lastLocation?.city,
      isCurrent: session.token === user.currentSessionToken
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <DashboardHeader user={user} />
      <main className="container mx-auto py-8 px-4">
        <DashboardStats user={user} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <SecurityOverview 
              stats={securityStats} 
              user={user} 
              className="mt-4" 
            />
          </div>
          <div>
            <ActivityFeed activities={user.recentActivity.map(activity => ({
              type: activity.type,
              timestamp: activity.timestamp.toISOString(),
              details: activity.details,
              status: activity.status
            }))} />
          </div>
        </div>
      </main>
    </div>
  )
}
