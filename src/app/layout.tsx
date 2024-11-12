import AutoFillButton from '@/components/auto-fill-form'
import Header from '@/components/navigation/navigation'
import Notice from '@/components/notice'
import TostiKaas from '@/components/Toaster'
import { geistMono, geistSans } from '@/core/config/fonts'
import { RootMetadata } from '@/core/config/metadata'
import '@/core/styles/globals.css'
import PageViewTracker from '@/features/analytics/components/page-view-tracker'
import AuthIndicator from '@/features/auth/helper/session-indicator'
import { getUser } from '@/features/auth/utilities/get-user'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import ToastProvider from '@/providers/toast-provider'
import { cn } from '@/shared/_docs/code-block/cn'
import LoadingIndicator from '@/shared/components/loading-indicator'
import { Suspense } from 'react'

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

	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<head>
				<ThemeScript />
			</head>
			<body
				className={cn(
					geistSans.variable,
					geistMono.variable,
					'antialiased'
				)}
				style={{
					background:
						'linear-gradient(135deg, #060606 0%, #090909 100%)'
				}}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					forcedTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					<AutoFillButton />
					<Suspense
						fallback={
							<LoadingIndicator loading={true}>
								{children}
							</LoadingIndicator>
						}
					>
						<Header />
						<AuthProvider initialUser={user}>
							<AuthIndicator
								initialState={{
									isAuthenticated: !!user,
									user: user
								}}
							/>
							<main className="mt-32 sm:mt-28">
								<PageViewTracker />
								{children}
							</main>
							<ToastProvider />
							<Notice />
							<TostiKaas />
						</AuthProvider>
					</Suspense>
				</ThemeProvider>
			</body>
		</html>
	)
}
