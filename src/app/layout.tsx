import { geistMono } from 'core/config/fonts';
import { baseMetadata } from 'core/config/metadata';
import type { Metadata } from 'next';
import '../styles/main.css';

export const metadata: Metadata = {
	...baseMetadata(),
};

export const dynamic = 'force-static';
export const preferredRegion = 'home';
export const revalidate = false;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${geistMono.variable} ${geistMono.variable}`}>
			<body>{children}</body>
		</html>
	);
}
