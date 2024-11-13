import { getUserData } from '@/app/server/queries'
import DashboardHeader from '@/components/dashboard/dashboard-header'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const user = await getUserData()
  
  if (!user) {
    return <div>Please log in to access dashboard</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
} 
