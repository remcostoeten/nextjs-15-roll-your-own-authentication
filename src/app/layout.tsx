import '@/styles/styles.css'
import { fontVariables } from '@/shared/config'
import { ThemeProvider } from '@/components/theme/providers'
import { Toaster } from 'sonner'
import FloatingTodo from '@/components/theme/floating-notes'
import { siteMetadata } from '@/shared/config/metadata'

export const metadata = {
	title: siteMetadata.title,
	description: siteMetadata.description,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const showFloatingTodo = process.env.NEXT_PUBLIC_ENABLE_FLOATING_TODO === 'true'

	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body className={fontVariables}>
				<ThemeProvider>
					{children}
					{showFloatingTodo && <FloatingTodo />}
					<Toaster
						richColors
						position="top-right"
					/>
				</ThemeProvider>
			</body>
		</html>
	)
}
