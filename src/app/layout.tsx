import Providers from '@/components/providers';
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
		<html
			lang="en"
			className={`${geistMono.variable} `}
			suppressHydrationWarning
			data-theme="supabase-dark"
		>
			<body className="bg-background text-foreground antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
