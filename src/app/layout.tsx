import '@/styles/styles.css'
import { ThemeProvider } from '@/components/theme/providers'
import { Toaster } from 'sonner'
import FloatingTodo from '@/components/theme/floating-notes'
import { Inter } from 'next/font/google'
import { cn } from '@/shared/utils'
import { WidgetProvider } from '@/shared/providers/widget-provider'
import { siteMetadata } from '@/core/config/metadata'
import { DevToolsWidget } from '@/modules/widgets/dev-tools/components/dev-tools-widget'
const inter = Inter({ subsets: ['latin'] })
export const metadata = siteMetadata

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	// Always set to false since we're showing it in the DevToolsWidget now
	const showFloatingTodo = false

	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body className={cn('min-h-screen bg-background antialiased', inter.className)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<WidgetProvider>
						{children}
						<DevToolsWidget showInProduction={true} />
					</WidgetProvider>
					<Toaster
						richColors
						position="top-right"
					/>
				</ThemeProvider>
			</body>
		</html>
	)
}
