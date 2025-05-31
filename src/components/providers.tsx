import { ToastProvider } from '@/shared/components/toast';
import { ThemeProvider } from './theme-provider';
import { AnalyticsSetup } from '@/modules/rollyourownanalytics/ui';

const analyticsConfig = {
	projectId: 'demo-project-id',
	domain: 'localhost:3000',
	trackPageviews: true,
	trackClicks: true,
	trackForms: true,
	trackScrolling: true,
	trackErrors: true,
	anonymizeIp: true,
	respectDnt: true,
	cookieless: false,
	debug: process.env.NODE_ENV === 'development',
};

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ToastProvider>
			<ThemeProvider>
				 <AnalyticsSetup config={analyticsConfig}> 	{children}				
				</AnalyticsSetup>
			</ThemeProvider>
		</ToastProvider>
	);
}
