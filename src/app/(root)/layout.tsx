import Navigation from '@/components/navigation'
import { geistMono, geistSans } from '@/core/config/fonts'
import '@/core/styles/globals.css'
import { AuthIndicator } from '@/features/auth/helper/session-indicator'
import { getUser } from '@/features/auth/utilities/get-user'
import { ThemeProvider } from '@/providers/theme-provider'
import ToastProvider from '@/providers/toast-provider'
import { cn } from '@/shared/_docs/code-block/cn'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getUser()
	const isAuthPage = (segment: string) => segment.startsWith('(auth)')
	const segment = children?.toString() || ''


	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeScript />
			</head>
			<body
					className={cn(
						'min-h-screen bg-background font-sans antialiased',
						geistSans.variable,
						geistMono.variable
					)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
				>
				<Navigation />
					<main
						className={cn(!isAuthPage(segment) && 'mt-32 sm:mt-28')}
					>
						{children}
					</main>
					<Suspense>
						<AuthIndicator
							initialState={{
								isAuthenticated: !!session,
								user: session?.user ?? null
							}}
						/>
					</Suspense>
					<Toaster />
					<ToastProvider />
				</ThemeProvider>
			</body>
		</html>
	)
}

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
