import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { THEME_PRESETS } from './gradient-presets'
type ThemePreset = keyof typeof THEME_PRESETS

type AnimationConfig = {
  duration: number
  intensity: number
  ease: string
}

type ThemeStore = {
  currentTheme: ThemePreset
  animation: AnimationConfig
  gradient?: string
  setTheme: (theme: ThemePreset) => void
  setAnimation: (animation: AnimationConfig) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: 'default' as ThemePreset,
      animation: {
        duration: 1,
        intensity: 1,
        ease: 'easeInOut'
      },
      setTheme: (theme: ThemePreset) => set({ currentTheme: theme }),
      setAnimation: (animation: AnimationConfig) => set({ animation }),
      // ... rest of your store config
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        animation: state.animation,
        gradient: state.gradient
      })
    }
  )
)
