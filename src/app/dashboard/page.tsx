import { Suspense } from 'react'
import { LoadingPage } from '@/components/ui/loading'
import { PageLayout } from '@/modules/dashboard/page-layout'
import { DashboardContent } from '@/modules/dashboard/components/dashboard-content'
export const dynamic = 'force-dynamic'
export const revalidate = 60

export default function DashboardPage() {
  return (
    <PageLayout>
      <Suspense fallback={<LoadingPage />}>
        <DashboardContent  />
      </Suspense>
    </PageLayout>
  )
}
