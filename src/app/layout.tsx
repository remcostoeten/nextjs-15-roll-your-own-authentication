import Header from '@/components/header'
import { geistMono, geistSans } from '@/core/config/fonts'
import { RootMetadata } from '@/core/config/metadata'
import '@/core/styles/globals.css'

export const metadata = RootMetadata

export default function RootLayout({ children }: PageProps) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Header />

				{children}
			</body>
		</html>
	)
}
