import AutoFillButton from '@/components/auto-fill-form'
import Navigation from '@/components/navigation'
import Notice from '@/components/notice'
import TaskReminder from '@/components/task-reminder/task-reminder'
import { geistMono, geistSans } from '@/core/config/fonts'
import { RootMetadata } from '@/core/config/metadata'
import '@/core/styles/globals.css'
import PageViewTracker from '@/features/analytics/components/page-view-tracker'
import { AuthIndicator } from '@/features/auth/helper/session-indicator'
import { getUser } from '@/features/auth/utilities/get-user'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import ToastProvider from '@/providers/toast-provider'
import { cn } from '@/shared/_docs/code-block/cn'
import LoadingIndicator from '@/shared/components/loading-indicator'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

export const metadata = RootMetadata

function ThemeScript() {
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `
					(function() {
						try {
							document.documentElement.classList.add('dark')
						} catch (e) {
							console.error(e)
						}
					})()
				`
			}}
		/>
	)
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const user = await getUser()
	const isAuthenticated = !!user

	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<head>
				<ThemeScript />
			</head>
			<body
				className={cn(
					geistSans.variable,
					geistMono.variable,
					'antialiased bg-background'
				)}
			>
				<AuthProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						forcedTheme="dark"
						enableSystem={false}
						disableTransitionOnChange
					>
						<AutoFillButton />
						<TaskReminder />
						<Suspense
							fallback={
								<LoadingIndicator loading={true}>
									{children}
								</LoadingIndicator>
							}
						>
							<Navigation />
							<AuthIndicator
								initialState={{
									isAuthenticated,
									user
								}}
							/>
							<main className="mt-32 sm:mt-28">
								<PageViewTracker />
								{children}
							</main>
							<ToastProvider />
							<Notice />
							<Toaster />
						</Suspense>
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	)
}
