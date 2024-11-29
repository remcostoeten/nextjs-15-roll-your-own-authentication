import { Header } from '@/components/theme/header/header'
import { mono } from '@/config/fonts'
import { metadata, viewport } from '@/config/metadata/root-metadata'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { ThemeProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { extractRouterConfig } from 'uploadthing/server'
import SessionStatus from '../components/_dev-tools/session-status'
import { featureFlags } from '../config/features'
import { uploadRouter } from '../server/uploadthing'
import { getUser } from '../services/auth/get-user'
import './globals.css'

export { metadata, viewport }
export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const user = await getUser()

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={`min-h-screen  ${mono.variable} font-sans antialiased`}
				suppressHydrationWarning
			>
				<ThemeProvider attribute="class" defaultTheme="dark">
					<script
						dangerouslySetInnerHTML={{
							__html: `
								try {
									if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
										document.documentElement.classList.add('dark')
									} else {
										document.documentElement.classList.remove('dark')
									}
								} catchNN{}
							`
						}}
					/>
					<NextSSRPlugin
						routerConfig={extractRouterConfig(uploadRouter)}
					/>
					<Header />
					<main className="mt-8">{children}</main>
					{featureFlags.sessionStatus && (
						<SessionStatus user={user} />
					)}
					<ToastContainer />
				</ThemeProvider>
			</body>
		</html>
	)
}
