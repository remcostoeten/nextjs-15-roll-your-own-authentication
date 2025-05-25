'use client';

import { Providers } from '@/components/providers';
import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

type Theme = 'catpuccini-dark' | 'supabase-dark' | 'caffeine-dark' | 'caffeine-light';

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [theme, setTheme] = useState<Theme>('caffeine-dark');

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider>
			<Providers>
				<main className="min-h-screen">{children}</main>
				<ThemeSwitcher />
			</Providers>
		</ThemeProvider>
	);
}
