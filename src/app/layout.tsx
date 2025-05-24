import { DevTools } from '@/modules/authenticatie/ui/dev-tools';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Authentication Demo',
	description: 'A clean Next.js authentication demo with login and registration',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<main className="min-h-screen bg-gray-50">{children}</main>
				<DevTools />
			</body>
		</html>
	);
}
