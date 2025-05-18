'use client';

import { Button } from '@/shared/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Coffee, Database, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeBase = 'catpuccini' | 'supabase' | 'caffeine';
type Theme = ThemeBase | `${ThemeBase}-dark`;

export function ThemeSwitcher() {
	const [theme, setTheme] = useState<Theme>('catpuccini');
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as Theme;
		if (savedTheme) {
			setTheme(savedTheme);
			setIsDark(savedTheme.includes('-dark'));
			document.documentElement.setAttribute('data-theme', savedTheme);
		}

		// Check system preference
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (!savedTheme && prefersDark) {
			setTheme('catpuccini-dark' as Theme);
			setIsDark(true);
			document.documentElement.setAttribute('data-theme', 'catpuccini-dark');
		}
	}, []);

	const toggleTheme = (baseTheme: ThemeBase) => {
		const newTheme = isDark ? (`${baseTheme}-dark` as Theme) : baseTheme;
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
	};

	const toggleDarkMode = () => {
		const baseTheme = theme.split('-')[0] as ThemeBase;
		const newTheme = !isDark ? (`${baseTheme}-dark` as Theme) : baseTheme;
		setTheme(newTheme);
		setIsDark(!isDark);
		localStorage.setItem('theme', newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
	};

	return (
		<div className="flex items-center gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						{theme.startsWith('catpuccini') && <Moon className="h-5 w-5" />}
						{theme.startsWith('supabase') && <Database className="h-5 w-5" />}
						{theme.startsWith('caffeine') && <Coffee className="h-5 w-5" />}
						<span className="sr-only">Change theme</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => toggleTheme('catpuccini')}>
						<Moon className="mr-2 h-4 w-4" />
						<span>Catpuccini</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => toggleTheme('supabase')}>
						<Database className="mr-2 h-4 w-4" />
						<span>Supabase</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => toggleTheme('caffeine')}>
						<Coffee className="mr-2 h-4 w-4" />
						<span>Caffeine</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Button variant="ghost" size="icon" onClick={toggleDarkMode}>
				{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
				<span className="sr-only">Toggle dark mode</span>
			</Button>
		</div>
	);
}
