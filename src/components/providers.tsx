import { ToastProvider } from '@/shared/components/toast';
import { ThemeProvider } from './theme-provider';
// import { AnalyticsSetup } from '@/modules/rollyourownanalytics/ui';

// const analyticsConfig = {
// 	projectId: 'demo-project-id',
// 	domain: 'localhost:3000',
// 	trackPageviews: true,
// 	trackClicks: true,
// 	trackForms: true,
// 	trackScrolling: true,
// 	trackErrors: true,
// 	anonymizeIp: true,
// 	respectDnt: true,
// 	cookieless: false,
// 	debug: process.env.NODE_ENV === 'development',
/**
 * Wraps child components with toast notification and theming context providers.
 *
 * Ensures that all nested components have access to toast notifications and theme settings.
 *
 * @param children - The React nodes to be rendered within the providers.
 */

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ToastProvider>
			<ThemeProvider>
				{children}
			</ThemeProvider>
		</ToastProvider>
	);
}
