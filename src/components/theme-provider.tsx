'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="data-theme"
			defaultTheme="catpuccini"
			themes={[
				'catpuccini',
				'catpuccini-dark',
				'supabase',
				'supabase-dark',
				'caffeine',
				'caffeine-dark',
			]}
			enableSystem={false}
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	);
}
