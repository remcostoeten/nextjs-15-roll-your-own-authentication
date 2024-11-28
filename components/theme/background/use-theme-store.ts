'use client'

import { create } from 'zustand'

type Theme = {
  id: string
  gradientId: string
  accent: string
  gradient: {
    from: string
    to: string
  }
  blur1: string
  blur2: string
}

const themes: Theme[] = [
  {
    id: 'sage',
    gradientId: 'bg0',
    accent: '#7C9082',
    gradient: {
      from: '#2F3B35',
      to: '#1A211D'
    },
    blur1: '#2F3B35',
    blur2: '#7C9082'
  },
  {
    id: 'ocean',
    gradientId: 'bg1',
    accent: '#6F8F9E',
    gradient: {
      from: '#2C3A42',
      to: '#1A2226'
    },
    blur1: '#2C3A42',
    blur2: '#6F8F9E'
  },
  {
    id: 'lavender',
    gradientId: 'bg2',
    accent: '#9B8AA6',
    gradient: {
      from: '#382F3D',
      to: '#1F1A22'
    },
    blur1: '#382F3D',
    blur2: '#9B8AA6'
  },
  {
    id: 'sand',
    gradientId: 'bg3',
    accent: '#B5A391',
    gradient: {
      from: '#3D3631',
      to: '#221F1C'
    },
    blur1: '#3D3631',
    blur2: '#B5A391'
  },
  {
    id: 'moss',
    gradientId: 'bg4',
    accent: '#8FA98C',
    gradient: {
      from: '#313D30',
      to: '#1C221B'
    },
    blur1: '#313D30',
    blur2: '#8FA98C'
  }
]

type ThemeStore = {
  activeTheme: Theme
  setTheme: (themeId: string) => void
  updateThemeColors: (themeId: string, colors: Partial<Theme>) => void
  resetTheme: (themeId: string) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  activeTheme: themes[0],
  setTheme: (themeId) => {
    const theme = themes.find(t => t.id === themeId) || themes[0]

    // Update CSS variables for global theming
    document.documentElement.style.setProperty('--accent-color', theme.accent)
    document.documentElement.style.setProperty('--accent-foreground', theme.accent)
    document.documentElement.style.setProperty('--accent-muted', `${theme.accent}66`) // 40% opacity
    document.documentElement.style.setProperty('--accent-hover', `${theme.accent}CC`) // 80% opacity
    document.documentElement.style.setProperty('--ring-color', `${theme.accent}33`) // 20% opacity
    document.documentElement.style.setProperty('--blur1-color', theme.blur1)
    document.documentElement.style.setProperty('--blur2-color', theme.blur2)
    document.documentElement.setAttribute('data-gradient', theme.gradientId)

    set({ activeTheme: theme })
  },
  updateThemeColors: (themeId, colors) =>
    set(state => {
      const newTheme = { ...state.activeTheme, ...colors }

      // Update CSS variables when colors change
      document.documentElement.style.setProperty('--accent-color', newTheme.accent)
      document.documentElement.style.setProperty('--accent-foreground', newTheme.accent)
      document.documentElement.style.setProperty('--accent-muted', `${newTheme.accent}66`)
      document.documentElement.style.setProperty('--accent-hover', `${newTheme.accent}CC`)
      document.documentElement.style.setProperty('--ring-color', `${newTheme.accent}33`)

      return { activeTheme: newTheme }
    }),
  resetTheme: (themeId) => {
    const theme = themes.find(t => t.id === themeId) || themes[0]
    set({ activeTheme: theme })
    // Reset CSS variables to default theme values
    document.documentElement.style.setProperty('--accent-color', theme.accent)
    document.documentElement.style.setProperty('--accent-foreground', theme.accent)
    document.documentElement.style.setProperty('--accent-muted', `${theme.accent}66`)
    document.documentElement.style.setProperty('--accent-hover', `${theme.accent}CC`)
    document.documentElement.style.setProperty('--ring-color', `${theme.accent}33`)
  }
}))
