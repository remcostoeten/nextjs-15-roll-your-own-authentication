import { Providers } from '@/components/providers';
import { ThemeProvider, ThemeSwitcher } from '@/modules/landing/components';
import { SidebarProvider } from '@/shared/components/ui';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Authentication Demo',
	description: 'A clean Next.js authentication demo with login and registration',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning className="dark">
			<body className="overflow-x-hidden" suppressHydrationWarning>
				<SidebarProvider>
					<ThemeProvider>
						<Providers>
							<main className="min-h-screen">{children}</main>
							<ThemeSwitcher />
						</Providers>
					</ThemeProvider>
				</SidebarProvider>
			</body>
		</html>
	);
}
