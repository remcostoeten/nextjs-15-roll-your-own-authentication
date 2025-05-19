import { useTheme as useNextTheme } from 'next-themes';
import { useCallback } from 'react';
import { themes } from '../config/theme.config';
import type { TTheme } from '../types';

export function useTheme() {
    const { theme, setTheme, ...rest } = useNextTheme();

    const currentTheme = theme?.replace('-dark', '') as TTheme;
    const isDark = theme?.endsWith('-dark') ?? false;

    const setCurrentTheme = useCallback((newTheme: TTheme) => {
        const nextTheme = isDark ? `${newTheme}-dark` : newTheme;
        setTheme(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
    }, [isDark, setTheme]);

    const toggleDarkMode = useCallback(() => {
        const nextTheme = isDark ? currentTheme : `${currentTheme}-dark`;
        setTheme(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
    }, [currentTheme, isDark, setTheme]);

    return {
        currentTheme,
        isDark,
        availableThemes: themes,
        setTheme: setCurrentTheme,
        toggleDarkMode,
        ...rest,
    };
}
