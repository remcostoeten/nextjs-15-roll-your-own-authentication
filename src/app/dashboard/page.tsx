import { Suspense } from 'react'
import { DashboardContent } from '@/modules/dashboard/components/DashboardContent'
import { LoadingPage } from '@/components/ui/loading'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // revalidate every minute

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <DashboardContent />
    </Suspense>
  )
}
