import Navigation from '@/components/navigation'
import { geistMono, geistSans } from '@/core/config/fonts'
import { RootMetadata } from '@/core/config/metadata'
import '@/core/styles/globals.css'
import { AuthIndicator } from '@/features/auth/helper/session-indicator.server'

export const metadata = RootMetadata

export default function RootLayout({ children }: PageProps) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Navigation />
				<AuthIndicator />
				{children}
			</body>
		</html>
	)
}
