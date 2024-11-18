"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"

type BackgroundConfig = {
  columns: number
  rows: number
  rotationAngle: number
  scale: number
  gapSize: number
  cellBorderRadius: number
  cellBorderWidth: number
  cellBorderColor: string
  cellBackgroundColor: string
  cellHoverColor: string
  animationDuration: number
  animationTimingFunction: string
}

const defaultConfig: BackgroundConfig = {
  columns: 12,
  rows: 8,
  rotationAngle: -12,
  scale: 1.2,
  gapSize: 16,
  cellBorderRadius: 12,
  cellBorderWidth: 1,
  cellBorderColor: "rgba(255, 255, 255, 0.08)",
  cellBackgroundColor: "rgba(255, 255, 255, 0.02)",
  cellHoverColor: "rgba(128, 128, 128, 0.5)",
  animationDuration: 700,
  animationTimingFunction: "ease-in-out"
}

function BackgroundGrid({ config }: { config: BackgroundConfig }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredCell(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null)
  }, [])

  if (!mounted) return null

  const cells = Array.from({ length: config.columns * config.rows })

  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        transform: `rotate(${config.rotationAngle}deg) scale(${config.scale})`,
        transition: `transform ${config.animationDuration}ms ${config.animationTimingFunction}`,
      }}
    >
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
          gridTemplateRows: `repeat(${config.rows}, 1fr)`,
          gap: config.gapSize,
          padding: config.gapSize,
        }}
      >
        {cells.map((_, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={cn(
                "absolute inset-0 transition-all duration-300",
                "hover:shadow-lg hover:scale-110"
              )}
              style={{
                borderRadius: config.cellBorderRadius,
                border: `${config.cellBorderWidth}px solid ${config.cellBorderColor}`,
                backgroundColor: hoveredCell === index ? config.cellHoverColor : config.cellBackgroundColor,
                transition: `all ${config.animationDuration}ms ${config.animationTimingFunction}`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Configurator() {
  const [config, setConfig] = useState<BackgroundConfig>(defaultConfig)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const updateConfig = (key: keyof BackgroundConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const renderPropsCode = () => {
    return `const backgroundConfig = ${JSON.stringify(config, null, 2)}`
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundGrid config={config} />
      <div className="relative z-10 container mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Square Grid Experiment</h1>
            <p className="text-white/60 mt-2">Customize the interactive background grid with various parameters</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">View Code</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Background Configuration</DialogTitle>
              </DialogHeader>
              <pre className="bg-background/40 p-4 rounded-lg overflow-auto">
                <code>{renderPropsCode()}</code>
              </pre>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-background/40 backdrop-blur-xl rounded-xl p-6 max-w-3xl">
          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Columns</label>
                  <Slider
                    min={4}
                    max={20}
                    step={1}
                    value={[config.columns]}
                    onValueChange={([value]) => updateConfig('columns', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Rows</label>
                  <Slider
                    min={4}
                    max={20}
                    step={1}
                    value={[config.rows]}
                    onValueChange={([value]) => updateConfig('rows', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Rotation</label>
                  <Slider
                    min={-45}
                    max={45}
                    step={1}
                    value={[config.rotationAngle]}
                    onValueChange={([value]) => updateConfig('rotationAngle', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Scale</label>
                  <Slider
                    min={1}
                    max={2}
                    step={0.1}
                    value={[config.scale]}
                    onValueChange={([value]) => updateConfig('scale', value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Gap Size</label>
                  <Slider
                    min={0}
                    max={32}
                    step={1}
                    value={[config.gapSize]}
                    onValueChange={([value]) => updateConfig('gapSize', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Border Radius</label>
                  <Slider
                    min={0}
                    max={24}
                    step={1}
                    value={[config.cellBorderRadius]}
                    onValueChange={([value]) => updateConfig('cellBorderRadius', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Border Color</label>
                  <Input
                    value={config.cellBorderColor}
                    onChange={(e) => updateConfig('cellBorderColor', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Background Color</label>
                  <Input
                    value={config.cellBackgroundColor}
                    onChange={(e) => updateConfig('cellBackgroundColor', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Hover Color</label>
                  <Input
                    value={config.cellHoverColor}
                    onChange={(e) => updateConfig('cellHoverColor', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="animation" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Duration (ms)</label>
                  <Slider
                    min={100}
                    max={2000}
                    step={100}
                    value={[config.animationDuration]}
                    onValueChange={([value]) => updateConfig('animationDuration', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Timing Function</label>
                  <Input
                    value={config.animationTimingFunction}
                    onChange={(e) => updateConfig('animationTimingFunction', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
