import Navigation from '@/components/navigation'
import { geistMono, geistSans } from '@/core/config/fonts'
import { RootMetadata } from '@/core/config/metadata'
import '@/core/styles/globals.css'
import PageViewTracker from '@/features/analytics/components/page-view-tracker'
import { AuthIndicator } from '@/features/auth/helper/session-indicator.server'
import { getSession } from '@/features/auth/session'
import ToastProvider from '@/providers/toast-provider'
import { cn } from '@/shared/_docs/code-block/cn'
import LoadingIndicator from '@/shared/components/loading-indicator'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

export const metadata = RootMetadata

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getSession()

	return (
		<html lang="en">
			<body
				className={cn(
					geistSans.variable,
					geistMono.variable,
					'antialiased'
				)}
			>
				<Suspense
					fallback={
						<LoadingIndicator loading={true}>
							{children}
						</LoadingIndicator>
					}
				>
					<Navigation
						isAuthenticated={!!session}
						initialUser={session || undefined}
					/>
					<AuthIndicator />
					<main className="mt-20 max-w-[1024px] mx-auto px-4">
						<PageViewTracker />
						{children}
					</main>
					<ToastProvider />
					<Toaster />
				</Suspense>
			</body>
		</html>
	)
}
