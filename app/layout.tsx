import { geistMono, geistSans } from '@/config/fonts'
import { RootMetadata as metadata } from '@/config/metadata'
import { ThemeProvider } from 'next-themes'
import Header from '../components/Header'
import Notice from '../components/notification-bar/notice'
import AuthPulser from '../features/authentication/helpers/auth-pulser'
import AutoFillButton from '../features/authentication/helpers/auto-fill-form'
import './globals.css'
import { getUserData } from './server/queries'

export { metadata }

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const user = await getUserData()

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					enableSystem={false}
					themes={['dark']}
				>
					<Header user={user} />
					<AutoFillButton />
					<Notice />
					{children}
					<AuthPulser />
				</ThemeProvider>
			</body>
		</html>
	)
}
