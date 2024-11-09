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
							const storageValue = localStorage.getItem('theme')
							const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
							document.documentElement.classList.add(storageValue ?? systemTheme)
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
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeScript />
			</head>
			<body
				className={cn(
					geistSans.variable,
					geistMono.variable,
					'antialiased'
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
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
						<Navigation
							isAuthenticated={isAuthenticated}
							initialUser={user}
						/>
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
			</body>
		</html>
	)
}
