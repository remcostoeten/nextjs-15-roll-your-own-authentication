import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { getSession } from '@/features/auth/actions/get-session.action'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getSession()

	if (!session) {
		redirect('/sign-in')
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<div className="container mx-auto max-w-page-size">{children}</div>
		</Suspense>
	)
}
