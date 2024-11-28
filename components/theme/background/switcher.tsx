'use client'

import { useToast } from '@/shared/primitives/toast'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Check, Settings, Undo } from 'lucide-react'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useThemeStore } from './use-theme-store'

type ColorKey = 'accent' | 'from' | 'to'

interface Theme {
  id: string
  gradient: {
    from: string
    to: string
  }
  accent: string
}

const themes: Theme[] = [
  { id: 'green', gradient: { from: '#10412F', to: 'black' }, accent: '#30917A' },
  { id: 'blue', gradient: { from: '#1a4b6e', to: '#051b2c' }, accent: '#2986cc' },
  { id: 'purple', gradient: { from: '#4a1b70', to: '#1a0829' }, accent: '#8e44ad' },
  { id: 'orange', gradient: { from: '#782c1f', to: '#2c0f0a' }, accent: '#e74c3c' },
  { id: 'teal', gradient: { from: '#1b4b2c', to: '#0a1f0f' }, accent: '#27ae60' }
]

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('presets')
  const [activeColorPicker, setActiveColorPicker] = useState<ColorKey | null>(null)
  const { activeTheme, setTheme, updateThemeColors, resetTheme } = useThemeStore()
  const { toast } = useToast()

  function handleColorChange(color: string) {
    if (!activeColorPicker) return

    updateThemeColors(activeTheme.id, {
      [activeColorPicker]: color
    })
  }

  function handleReset() {
    resetTheme(activeTheme.id)
    toast({
      description: "Theme colors have been reset to default values",
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg transition-colors duration-200 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
      >
        <Settings size={18} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Theme Settings</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {themes.map(theme => (
                  <div
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className="relative cursor-pointer group"
                  >
                    <div
                      className="h-24 rounded-lg group-hover:ring-2 ring-black/5 dark:ring-white/5"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, ${theme.gradient.from}, ${theme.gradient.to})`
                      }}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{theme.id}</span>
                      {activeTheme.id === theme.id && (
                        <Check size={16} className="text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="customize" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Accent Color</span>
                  <div className="flex items-center gap-2">
                    <Input
                      value={activeTheme.accent}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-24"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setActiveColorPicker('accent')}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: activeTheme.accent }}
                      />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gradient Start</span>
                  <div className="flex items-center gap-2">
                    <Input
                      value={activeTheme.gradient.from}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-24"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setActiveColorPicker('from')}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: activeTheme.gradient.from }}
                      />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gradient End</span>
                  <div className="flex items-center gap-2">
                    <Input
                      value={activeTheme.gradient.to}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-24"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setActiveColorPicker('to')}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: activeTheme.gradient.to }}
                      />
                    </Button>
                  </div>
                </div>

                {activeColorPicker && (
                  <div className="absolute mt-2 z-50">
                    <HexColorPicker
                      color={
                        activeColorPicker === 'accent'
                          ? activeTheme.accent
                          : activeColorPicker === 'from'
                            ? activeTheme.gradient.from
                            : activeTheme.gradient.to
                      }
                      onChange={handleColorChange}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <Undo size={16} />
              Reset Colors
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
