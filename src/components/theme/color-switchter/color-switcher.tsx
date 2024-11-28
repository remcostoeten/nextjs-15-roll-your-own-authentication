'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui'
import { Check, Settings } from 'lucide-react'
import { useState } from 'react'
import { create } from 'zustand'

interface ThemeStore {
  activeTheme: string
  setTheme: (theme: string) => void
}

const useThemeStore = create<ThemeStore>((set) => ({
  activeTheme: 'green',
  setTheme: (theme) => {
    set({ activeTheme: theme })
    document.documentElement.style.setProperty('--accent-color', theme)
  }
}))

const themes = [
  { id: 'green', color: 'from-[#10412F] to-black', accent: '#30917A' },
  { id: 'blue', color: 'from-[#1a4b6e] to-[#051b2c]', accent: '#2986cc' },
  { id: 'purple', color: 'from-[#4a1b70] to-[#1a0829]', accent: '#8e44ad' },
  { id: 'orange', color: 'from-[#782c1f] to-[#2c0f0a]', accent: '#e74c3c' },
  { id: 'teal', color: 'from-[#1b4b2c] to-[#0a1f0f]', accent: '#27ae60' }
]

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const { activeTheme, setTheme } = useThemeStore()

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 rounded-lg transition-colors duration-200 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white">
        <Settings size={18} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg transition-colors duration-200 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white">
            <Settings size={18} />
          </button>
        </DialogTrigger>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Theme Settings</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {themes.map(theme => (
              <div 
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className="relative cursor-pointer group"
              >
                <div className={`h-24 rounded-lg bg-gradient-to-b ${theme.color} group-hover:ring-2 ring-black/5 dark:ring-white/5`}>
                  <div className="absolute inset-0 animate-pulse" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{theme.id}</span>
                  {activeTheme === theme.id && (
                    <Check size={16} className="text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}