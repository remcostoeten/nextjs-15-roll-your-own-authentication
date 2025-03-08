import '@/styles/styles.css'
import { fontVariables, siteMetadata } from '@/core/config'
import { ThemeProvider } from '@/components/theme/providers'

export const metadata = siteMetadata

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={fontVariables}>
				<ThemeProvider>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
