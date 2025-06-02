'use client';

import { Moon, MoonIcon, Sun, SunDim } from 'lucide-react';
import { useTheme } from './ThemeProvider';

/**
 * Renders a UI component that allows users to switch between available themes.
 *
 * Displays a set of theme buttons, each with an icon and label, enabling users to select and apply a different theme.
 */
export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	const themes = [
		{
			name: 'caffeine-dark',
			icon: Sun,
			label: 'Caffeine Dark',
		},
		{
			name: 'catpuccini-dark',
			icon: Moon,
			label: 'Catpuccini Dark',
		},
		{
			name: 'supabase-dark',
			icon: MoonIcon,
			label: 'Supabase Dark',
		},
		{
			name: 'supabase-light',
			icon: SunDim,
			label: 'Supabase Light',
		},
	];

	return (
		<div className="fixed bottom-8 right-8 bg-background shadow-lg border rounded-full p-2">
			<div className="flex items-center space-x-2">
				{themes.map((t) => {
					const Icon = t.icon;
					return (
						<button
							key={t.name}
							onClick={() => setTheme(t.name as any)}
							className={`p-2 rounded-full transition-colors ${
								theme === t.name
									? 'bg-foreground/10 dark:bg-foreground/50 text-foreground/50 dark:text-foreground/50'
									: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
							}`}
							title={t.label}
						>
							<Icon className="w-5 h-5" />
						</button>
					);
				})}
			</div>
		</div>
	);
}
