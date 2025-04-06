import { TooltipProvider } from '@radix-ui/react-tooltip'
import { ThemeProvider } from 'next-themes'
import { CustomToaster } from './ui/custom-toast'
import { SidebarProvider } from './dashboard/sidebar/sidebar'
import { UserProvider } from './user-provider'

// ToDO: Add analytics provider

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<UserProvider>
			<TooltipProvider delayDuration={50}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
				>
					<CustomToaster />
					<SidebarProvider>{children}</SidebarProvider>
				</ThemeProvider>
			</TooltipProvider>
		</UserProvider>
	)
}
