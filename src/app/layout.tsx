import { DevTools } from '@/modules/authenticatie/ui/dev-tools';
import { ToastProvider } from '@/shared/components/toast';
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
			<body className={inter.className}>
				<ToastProvider>
					<main className="min-h-screen bg-gray-50">{children}</main>
					<DevTools />
				</ToastProvider>
			</body>
		</html>
	);
}
