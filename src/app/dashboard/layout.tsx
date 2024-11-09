import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { getSession } from '@/features/auth/actions/get-session.action'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

function Loading() {
	return (
		<div className="flex h-screen items-center justify-center">
			<LoadingSpinner />
		</div>
	)
}

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getSession()

	if (!session) {
		redirect('/sign-in')
	}

	return <Suspense fallback={<Loading />}>{children}</Suspense>
}
