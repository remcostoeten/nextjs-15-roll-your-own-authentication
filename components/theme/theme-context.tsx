'use client'

import { createContext, useContext, useState } from 'react'
import { THEME_PRESETS } from './background/gradient-presets'

type ThemePreset = keyof typeof THEME_PRESETS

type ThemeContextType = {
    currentTheme: ThemePreset
    setTheme: (theme: ThemePreset) => void
}

const ThemeContext = createContext<ThemeContextType>({
    currentTheme: 'default',
    setTheme: () => null
})

export function useTheme() {
    return useContext(ThemeContext)
}

type ThemeProviderProps = {
    children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [currentTheme, setTheme] = useState<ThemePreset>('default')

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
} 
