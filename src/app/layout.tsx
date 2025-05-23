import { Providers } from '@/modules/layout/providers';
import { ThemeProvider } from '@/modules/theme/providers/theme-provider';
import type { TTheme } from '@/modules/theme/types';
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
			className={geistMono.variable}
			suppressHydrationWarning
			data-theme="catpuccini-dark"
		>
			<body className="bg-background text-foreground antialiased min-h-screen flex flex-col items-center justify-center">
				<ThemeProvider>
					<Providers>{children}</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
