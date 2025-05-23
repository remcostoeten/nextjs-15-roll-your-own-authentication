import type { LucideIcon } from 'lucide-react';

export type TTheme = 'catpuccini' | 'supabase' | 'caffeine' | 'night-bourbon';

export type TThemeItem = {
	key: TTheme;
	icon: LucideIcon;
	label: string;
	class: string;
};

export type TThemeConfig = {
	themes: TThemeItem[];
	defaultTheme: TTheme;
	darkMode: boolean;
};
