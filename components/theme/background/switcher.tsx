'use client'

import { CodeBlock } from "@/components/primitives/code-block/code-block"
import { useToast } from "@/components/primitives/toast"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useThemeStore } from "@/core/stores/theme-store"
import { cn } from "@/lib/utils"
import { Code2, Minimize2, Palette } from "lucide-react"
import { useState } from "react"
import { useTheme } from "../theme-context"
import { THEME_PRESETS } from "./gradient-presets"
import ThemePreview from "./theme-preview"

type ThemePreset = keyof typeof THEME_PRESETS

type Props = {
  onThemeChange?: (theme: ThemePreset) => void
}

export default function ThemeSwitcher({ onThemeChange }: Props) {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const { toast } = useToast()
  const { currentTheme, setTheme } = useTheme()
  const setStoreTheme = useThemeStore(state => state.setTheme)

  function handleThemeChange(themeKey: ThemePreset) {
    setTheme(themeKey)
    setStoreTheme(themeKey)
    onThemeChange?.(themeKey)
    toast({
      title: "Theme updated",
      description: `Switched to ${THEME_PRESETS[themeKey].name} theme`,
    })
    console.log(`Theme changed to: ${themeKey}`)
  }

  function handleFileClick(themeKey: ThemePreset) {
    const theme = THEME_PRESETS[themeKey]
    const code = `export const ${themeKey}Theme = {
  name: '${theme.name}',
  gradient: '${theme.gradient}',
  colors: {
    background: '${theme.colors.background}',
    primary: '${theme.colors.primary}',
    secondary: '${theme.colors.secondary}',
    accent1: '${theme.colors.accent1}',
    accent2: '${theme.colors.accent2}'
  }
}`
    setSelectedFile(code)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className={cn(
          "w-[400px] sm:w-[540px]",
          "bg-background/40 dark:bg-background/40",
          "backdrop-blur-xl backdrop-filter",
          "border-l border-white/20",
          "shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
          "transition-all duration-200",
          minimized && "w-[80px] sm:w-[80px] p-0"
        )}
      >
        {minimized ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setMinimized(false)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold text-white">Theme Studio</SheetTitle>
              <p className="text-sm text-white/60">
                Customize your experience with our theme presets and animation controls
              </p>
            </SheetHeader>

            <div className="absolute right-4 top-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="themes" className="mt-8">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/5">
                <TabsTrigger value="themes">Themes</TabsTrigger>
                <TabsTrigger value="animations">Animations</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="themes">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                    <div key={key} className="relative group">
                      <ThemePreview
                        preset={preset}
                        isSelected={currentTheme === key}
                        onClick={() => handleThemeChange(key as ThemePreset)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFileClick(key as ThemePreset)
                        }}
                      >
                        <Code2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="animations" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white">Animation Duration</label>
                    <Slider
                      defaultValue={[1]}
                      max={2}
                      step={0.1}
                      className="mt-2"
                      onValueChange={(value) => {
                        useThemeStore.setState((state) => ({
                          animation: { ...state.animation, duration: value[0] }
                        }))
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white">Animation Intensity</label>
                    <Slider
                      defaultValue={[1]}
                      max={2}
                      step={0.1}
                      className="mt-2"
                      onValueChange={(value) => {
                        useThemeStore.setState((state) => ({
                          animation: { ...state.animation, intensity: value[0] }
                        }))
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white">Animation Easing</label>
                    <Select
                      onValueChange={(value) => {
                        useThemeStore.setState((state) => ({
                          animation: { ...state.animation, ease: value }
                        }))
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select easing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="easeInOut">Ease In Out</SelectItem>
                        <SelectItem value="easeIn">Ease In</SelectItem>
                        <SelectItem value="easeOut">Ease Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Enable Animations</label>
                    <Switch
                      onCheckedChange={(checked) => {
                        // Add your animation toggle logic here
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Reduce Motion</label>
                    <Switch
                      onCheckedChange={(checked) => {
                        // Add your reduce motion logic here
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">High Contrast</label>
                    <Switch
                      onCheckedChange={(checked) => {
                        // Add your high contrast logic here
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {selectedFile && (
              <div className="mt-6 p-4 rounded-lg bg-background/60 backdrop-blur-sm">
                <CodeBlock
                  code={selectedFile}
                  language="typescript"
                  showLineNumbers
                />
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
} 
