import { inter } from '@/core/config/fonts';
import { baseMetadata } from '@/core/config/metadata';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	...baseMetadata(),
};

export const dynamic = 'force-static';
export const preferredRegion = 'home';
export const revalidate = false;

function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="dark">
			<body className={`${inter.variable} font-sans antialiased`}>{children}</body>
		</html>
	);
}

// Optimize component for static rendering
export default RootLayout;
