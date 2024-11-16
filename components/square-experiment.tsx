"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCallback, useEffect, useState } from "react"
import { Label } from "recharts"
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
  const [hoveredCells, setHoveredCells] = useState<Set<string>>(new Set())
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const rotationAngle = config.rotationAngle * (Math.PI / 180)
    const cos = Math.cos(-rotationAngle)
    const sin = Math.sin(-rotationAngle)
    
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotatedX = (x * cos - y * sin) + rect.width / 2
    const rotatedY = (x * sin + y * cos) + rect.height / 2
    
    const gridX = Math.floor(rotatedX / (rect.width / config.columns))
    const gridY = Math.floor(rotatedY / (rect.height / config.rows))
    
    if (gridX >= 0 && gridX < config.columns && gridY >= 0 && gridY < config.rows) {
      const index = gridY * config.columns + gridX
      setHoveredCells((prev) => {
        const next = new Set(prev)
        next.add(index.toString())
        setTimeout(() => {
          setHoveredCells((prev) => {
            const next = new Set(prev)
            next.delete(index.toString())
            return next
          })
        }, config.animationDuration)
        return next
      })
    }
  }, [config])

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * (config.columns * config.rows))
      setHoveredCells((prev) => {
        const next = new Set(prev)
        next.add(randomIndex.toString())
        setTimeout(() => {
          setHoveredCells((prev) => {
            const next = new Set(prev)
            next.delete(randomIndex.toString())
            return next
          })
        }, config.animationDuration)
        return next
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [config])

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden bg-[#0A0A0A]"
      onMouseMove={handleMouseMove}
    >
      <div 
        className="absolute inset-0 -inset-x-40"
        style={{
          transform: `rotate(${config.rotationAngle}deg) scale(${config.scale})`,
        }}
      >
        <div 
          className="h-full p-8"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
            gridTemplateRows: `repeat(${config.rows}, 1fr)`,
            gap: `${config.gapSize}px`,
          }}
        >
          {Array.from({ length: config.columns * config.rows }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: `${config.cellBorderRadius}px`,
                border: `${config.cellBorderWidth}px solid ${config.cellBorderColor}`,
                backgroundColor: hoveredCells.has(i.toString()) ? config.cellHoverColor : config.cellBackgroundColor,
                transition: `all ${config.animationDuration}ms ${config.animationTimingFunction}`,
              }}
            />
          ))}
        </div>
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
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <BackgroundGrid config={config} />
      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold mb-8">Background Configurator</h1>
        <Tabs defaultValue="layout" className="w-full max-w-3xl">
          <TabsList>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="animation">Animation</TabsTrigger>
          </TabsList>
          <TabsContent value="layout" className="space-y-4">
            <div>
              <Label>Columns</Label>
              <Slider 
                min={4} 
                max={20} 
                step={1} 
                value={[config.columns]} 
                onValueChange={([value]) => updateConfig('columns', value)} 
              />
            </div>
            <div>
              <Label>Rows</Label>
              <Slider 
                min={4} 
                max={20} 
                step={1} 
                value={[config.rows]} 
                onValueChange={([value]) => updateConfig('rows', value)} 
              />
            </div>
            <div>
              <Label>Rotation Angle</Label>
              <Slider 
                min={-45} 
                max={45} 
                step={1} 
                value={[config.rotationAngle]} 
                onValueChange={([value]) => updateConfig('rotationAngle', value)} 
              />
            </div>
            <div>
              <Label>Scale</Label>
              <Slider 
                min={1} 
                max={2} 
                step={0.1} 
                value={[config.scale]} 
                onValueChange={([value]) => updateConfig('scale', value)} 
              />
            </div>
            <div>
              <Label>Gap Size</Label>
              <Slider 
                min={0} 
                max={32} 
                step={1} 
                value={[config.gapSize]} 
                onValueChange={([value]) => updateConfig('gapSize', value)} 
              />
            </div>
          </TabsContent>
          <TabsContent value="appearance" className="space-y-4">
            <div>
              <Label>Cell Border Radius</Label>
              <Slider 
                min={0} 
                max={24} 
                step={1} 
                value={[config.cellBorderRadius]} 
                onValueChange={([value]) => updateConfig('cellBorderRadius', value)} 
              />
            </div>
            <div>
              <Label>Cell Border Width</Label>
              <Slider 
                min={0} 
                max={5} 
                step={1} 
                value={[config.cellBorderWidth]} 
                onValueChange={([value]) => updateConfig('cellBorderWidth', value)} 
              />
            </div>
            <div>
              <Label>Cell Border Color</Label>
              <Input 
                type="text" 
                value={config.cellBorderColor} 
                onChange={(e) => updateConfig('cellBorderColor', e.target.value)} 
              />
            </div>
            <div>
              <Label>Cell Background Color</Label>
              <Input 
                type="text" 
                value={config.cellBackgroundColor} 
                onChange={(e) => updateConfig('cellBackgroundColor', e.target.value)} 
              />
            </div>
            <div>
              <Label>Cell Hover Color</Label>
              <Input 
                type="text" 
                value={config.cellHoverColor} 
                onChange={(e) => updateConfig('cellHoverColor', e.target.value)} 
              />
            </div>
          </TabsContent>
          <TabsContent value="animation" className="space-y-4">
            <div>
              <Label>Animation Duration (ms)</Label>
              <Slider 
                min={100} 
                max={2000} 
                step={100} 
                value={[config.animationDuration]} 
                onValueChange={([value]) => updateConfig('animationDuration', value)} 
              />
            </div>
            <div>
              <Label>Animation Timing Function</Label>
              <Input 
                type="text" 
                value={config.animationTimingFunction} 
                onChange={(e) => updateConfig('animationTimingFunction', e.target.value)} 
              />
            </div>
          </TabsContent>
        </Tabs>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-8">Show Props Code</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Background Configuration Props</DialogTitle>
            </DialogHeader>
            <pre className="bg-gray-900 p-4 rounded-md overflow-auto">
              <code>{renderPropsCode()}</code>
            </pre>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
