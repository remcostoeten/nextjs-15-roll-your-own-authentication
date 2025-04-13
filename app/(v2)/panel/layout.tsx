import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Supabase Studio',
	description: 'Supabase Studio',
	applicationName: 'Supabase Studio',
	themeColor: '#1E1E1E',
	generator: 'v0.dev',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="en"
			data-theme="dark"
			className="dark"
		>
			<body className="bg-[#1E1E1E] text-white">{children}</body>
		</html>
	)
}
