import './globals.css'
import { ThemeProvider } from '@/components/theme-wrapper'
import Nav from '@/components/layout/header/nav'
import UserProvider from '@/contexts/user-context'
import DevTools from '@/features/dev-tools/_dev-tools'
import { config } from '@/core/config'

export const metadata = config.metadata.root

type RootLayoutProps = PageProps

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<body
				className={`h-screen bg-background text-foreground ${config.fonts.variables} font-geist-mono`}
				style={{ maxHeight: '100vh'}}
			>
				<UserProvider>
					<ThemeProvider>
						<Nav positionFixed={true} />
						<main
							className="flex-grow h-screen overflow-auto"
							style={{ maxHeight: 'calc(100vh - 64px)' }}
						>
							{children}
						</main>
						{config.features.isEnabled(
							config.features.FeatureFlag.DEV_TOOLS
						) && <DevTools />}
					</ThemeProvider>
				</UserProvider>
			</body>
		</html>
	)
}
