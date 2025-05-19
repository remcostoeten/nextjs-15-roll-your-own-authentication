import { Coffee, Database, Palette, ThermometerSun } from 'lucide-react';
import type { TThemeConfig, TThemeItem } from '../types';

export const themes: TThemeItem[] = [
    {
        key: 'catpuccini',
        icon: Palette,
        label: 'Catpuccini theme',
        class: 'bg-background text-foreground',
    },
    {
        key: 'supabase',
        icon: Database,
        label: 'Supabase theme',
        class: 'bg-background text-foreground',
    },
    {
        key: 'caffeine',
        icon: Coffee,
        label: 'Caffeine theme',
        class: 'bg-background text-foreground',
    },
    {
        key: 'night-bourbon',
        icon: ThermometerSun,
        label: 'Night Bourbon theme',
        class: 'bg-background text-foreground',
    },
] as const;

export const themeConfig: TThemeConfig = {
    themes,
    defaultTheme: 'caffeine',
    darkMode: true,
} as const;
