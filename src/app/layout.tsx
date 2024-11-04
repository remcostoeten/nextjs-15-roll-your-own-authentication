import { geistMono, geistSans } from '@/core/config/fonts'
import { metadata } from '@/core/config/metadata'
import '@/core/styles/globals.css'

export { metadata }

export default function RootLayout({ children }: PageProps) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	)
}
