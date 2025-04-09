import type React from 'react'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { CustomToaster } from '@/components/ui/custom-toast'
import type { Metadata } from 'next'
import Providers from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Custom JWT Authentication',
	description: 'A custom JWT authentication system with Next.js',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body
				className={`${inter.className} w-screen h-screen bg-background`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
