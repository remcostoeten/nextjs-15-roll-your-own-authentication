'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<NextThemesProvider
			attribute="data-theme"
			defaultTheme="caffeine"
			forcedTheme={!mounted ? 'caffeine' : undefined}
			themes={[
				'catpuccini',
				'catpuccini-dark',
				'supabase',
				'supabase-dark',
				'caffeine',
				'caffeine-dark',
				'night-bourbon',
				'night-bourbon-dark'
			]}
			enableSystem={false}
			storageKey="theme-preference"
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	);
}
