"use client"

import { CodeBlock } from "@/components/ui/code-block"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"
import { Button } from "../../components/ui/button"

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
  hoverScale: number
  hoverRotation: number
  trailScale: number
  trailOpacity: number
  shadowColor: string
  shadowBlur: number
  blurEffect: number
  glowColor: string
  glowIntensity: number
  rippleEffect: boolean
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
  animationTimingFunction: "ease-in-out",
  hoverScale: 1.1,
  hoverRotation: 0,
  trailScale: 0.95,
  trailOpacity: 0.7,
  shadowColor: "rgba(0,0,0,0.3)",
  shadowBlur: 30,
  blurEffect: 0,
  glowColor: "rgba(255,255,255,0.1)",
  glowIntensity: 2,
  rippleEffect: true
}

function BackgroundGrid({ config }: { config: BackgroundConfig }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<number | null>(null)
  const [previousCell, setPreviousCell] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseEnter = useCallback((index: number) => {
    setPreviousCell(hoveredCell)
    setHoveredCell(index)
  }, [hoveredCell])

  const handleMouseLeave = useCallback(() => {
    setPreviousCell(hoveredCell)
    setHoveredCell(null)
  }, [hoveredCell])

  if (!mounted) return null

  const cells = Array.from({ length: config.columns * config.rows })

  const getCellStyle = (index: number) => {
    const isHovered = hoveredCell === index
    const wasPreviouslyHovered = previousCell === index
    const baseTransition = `all ${config.animationDuration}ms ${config.animationTimingFunction}`

    return {
      borderRadius: config.cellBorderRadius,
      border: `${config.cellBorderWidth}px solid ${config.cellBorderColor}`,
      backgroundColor: isHovered ? config.cellHoverColor : config.cellBackgroundColor,
      transition: `${baseTransition}, transform 600ms cubic-bezier(0.4, 0, 0.2, 1)`,
      transform: isHovered ? 'scale(1.1)' : wasPreviouslyHovered ? 'scale(0.95)' : 'scale(1)',
      opacity: wasPreviouslyHovered ? 0.7 : 1,
      transformOrigin: 'center',
      boxShadow: isHovered ? '0 10px 30px -10px rgba(0,0,0,0.3)' : 'none',
    }
  }

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
                "absolute inset-0 transition-all",
                "hover:shadow-lg"
              )}
              style={getCellStyle(index)}
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

  const renderComponentCode = () => {
    return `import { BackgroundGrid } from '@/components/background-grid'

export default function MyComponent() {
  const config = ${JSON.stringify(config, null, 2)}

  return (
    <div className="relative min-h-screen">
      <BackgroundGrid config={config} />
      {/* Your content here */}
    </div>
  )
}`
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
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Blur Effect</label>
                  <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={[config.blurEffect]}
                    onValueChange={([value]) => updateConfig('blurEffect', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Glow Intensity</label>
                  <Slider
                    min={0}
                    max={5}
                    step={0.1}
                    value={[config.glowIntensity]}
                    onValueChange={([value]) => updateConfig('glowIntensity', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Glow Color</label>
                  <Input
                    value={config.glowColor}
                    onChange={(e) => updateConfig('glowColor', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Shadow Color</label>
                  <Input
                    value={config.shadowColor}
                    onChange={(e) => updateConfig('shadowColor', e.target.value)}
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Hover Scale</label>
                  <Slider
                    min={1}
                    max={1.5}
                    step={0.05}
                    value={[config.hoverScale]}
                    onValueChange={([value]) => updateConfig('hoverScale', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Hover Rotation</label>
                  <Slider
                    min={-180}
                    max={180}
                    step={5}
                    value={[config.hoverRotation]}
                    onValueChange={([value]) => updateConfig('hoverRotation', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Trail Scale</label>
                  <Slider
                    min={0.5}
                    max={1}
                    step={0.05}
                    value={[config.trailScale]}
                    onValueChange={([value]) => updateConfig('trailScale', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Trail Opacity</label>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[config.trailOpacity]}
                    onValueChange={([value]) => updateConfig('trailOpacity', value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <Switch
                      checked={config.rippleEffect}
                      onCheckedChange={(checked) => updateConfig('rippleEffect', checked)}
                    />
                    <span className="ml-3 text-sm font-medium text-white">Enable Ripple Effect</span>
                  </label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className="bg-background/60 rounded-lg p-4">
                <CodeBlock
                  code={renderComponentCode()}
                  language="typescript"
                  showLineNumbers
                />
              </div>
              <p className="text-sm text-white/60">
                Copy this code to use the BackgroundGrid component in your project.
                Make sure to import the component and required styles.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
