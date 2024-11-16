"use client"

import { ToastProps, Toaster, useToast } from '@/components/primitives/toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from 'react'
import { HexColorPicker } from "react-colorful"

type ToastAnimation = 'slide' | 'fade' | 'zoom' | 'bounce' | 'custom';

const PREDEFINED_ANIMATIONS = {
  slide: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  zoom: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 } },
  bounce: { initial: { opacity: 0, y: 50, scale: 0.8 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 50, scale: 0.8 } },
}

export default function AdvancedToastPlayground() {
  const toast = useToast()
  const [toastConfig, setToastConfig] = useState<Partial<ToastProps & { animation: ToastAnimation }>>({
    title: 'Toast Title',
    message: 'This is a toast message',
    variant: 'default',
    position: 'bottom-right',
    duration: 5000,
    animation: 'slide',
    showProgress: true,
    showIcon: true,
  })
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [intervalDuration, setIntervalDuration] = useState(10)
  const [customStyles, setCustomStyles] = useState({
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    borderColor: '#000000',
    height: '4rem',
  })
  const [customAnimation, setCustomAnimation] = useState({
    x1: 0.25,
    y1: 0.1,
    x2: 0.25,
    y2: 1,
  })
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)

  const showToast = () => {
    const animationConfig = toastConfig.animation === 'custom' 
      ? { 
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 50 },
          transition: { 
            duration: 0.5,
            ease: [customAnimation.x1, customAnimation.y1, customAnimation.x2, customAnimation.y2]
          }
        }
      : PREDEFINED_ANIMATIONS[toastConfig.animation as keyof typeof PREDEFINED_ANIMATIONS]

    toast[toastConfig.variant as keyof typeof toast](toastConfig.message, {
      ...toastConfig,
      style: {
        ...customStyles,
        border: `1px solid ${customStyles.borderColor}`,
      },
      customAnimationConfig: toastConfig.animation === 'custom' ? animationConfig : undefined,
    } as any)
  }

  const toggleInterval = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    } else {
      const id = setInterval(showToast, intervalDuration * 1000)
      setIntervalId(id)
    }
  }

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [intervalId])

  const updateConfig = (key: keyof ToastProps, value: any) => {
    setToastConfig(prev => ({ ...prev, [key]: value }))
  }

  const updateCustomStyle = (key: keyof typeof customStyles, value: string) => {
    setCustomStyles(prev => ({ ...prev, [key]: value }))
  }

  const updateCustomAnimation = (key: keyof typeof customAnimation, value: number) => {
    setCustomAnimation(prev => ({ ...prev, [key]: value }))
  }

  const generateCodeSnippet = () => {
    const animationConfig = toastConfig.animation === 'custom' 
      ? `customAnimationConfig: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { 
      duration: 0.5,
      ease: [${customAnimation.x1}, ${customAnimation.y1}, ${customAnimation.x2}, ${customAnimation.y2}]
    }
  }`
      : `animation: "${toastConfig.animation}"`

    return `toast.${toastConfig.variant}("${toastConfig.message}", {
  title: "${toastConfig.title}",
  position: "${toastConfig.position}",
  duration: ${toastConfig.duration},
  ${animationConfig},
  showProgress: ${toastConfig.showProgress},
  showIcon: ${toastConfig.showIcon},
  style: {
    borderRadius: "${customStyles.borderRadius}",
    backgroundColor: "${customStyles.backgroundColor}",
    color: "${customStyles.color}",
    borderColor: "${customStyles.borderColor}",
    height: "${customStyles.height}",
    border: "1px solid ${customStyles.borderColor}",
  },
})`
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Advanced Toast Playground</h1>
      
      <Tabs defaultValue="config">
        <TabsList>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
          <TabsTrigger value="animation">Animation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Title</label>
              <Input
                value={toastConfig.title}
                onChange={(e) => updateConfig('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Message</label>
              <Input
                value={toastConfig.message}
                onChange={(e) => updateConfig('message', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Variant</label>
              <Select
                value={toastConfig.variant}
                onValueChange={(value) => updateConfig('variant', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Position</label>
              <Select
                value={toastConfig.position}
                onValueChange={(value) => updateConfig('position', value as ToastProps['position'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="top-center">Top Center</SelectItem>
                  <SelectItem value="bottom-center">Bottom Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Duration (ms)</label>
              <Input
                type="number"
                value={toastConfig.duration}
                onChange={(e) => updateConfig('duration', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block mb-2">Animation</label>
              <Select
                value={toastConfig.animation}
                onValueChange={(value) => updateConfig('animation', value as ToastAnimation)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="bounce">Bounce</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={toastConfig.showProgress}
              onCheckedChange={(checked) => updateConfig('showProgress', checked)}
            />
            <label>Show Progress</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={toastConfig.showIcon}
              onCheckedChange={(checked) => updateConfig('showIcon', checked)}
            />
            <label>Show Icon</label>
          </div>
        </TabsContent>
        
        <TabsContent value="styling" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Border Radius</label>
              <Input
                value={customStyles.borderRadius}
                onChange={(e) => updateCustomStyle('borderRadius', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Height</label>
              <Input
                value={customStyles.height}
                onChange={(e) => updateCustomStyle('height', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Background Color</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={customStyles.backgroundColor}
                  onChange={(e) => updateCustomStyle('backgroundColor', e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => setShowColorPicker(showColorPicker === 'backgroundColor' ? null : 'backgroundColor')}
                >
                  Pick
                </Button>
              </div>
              {showColorPicker === 'backgroundColor' && (
                <div className="mt-2">
                  <HexColorPicker
                    color={customStyles.backgroundColor}
                    onChange={(color) => updateCustomStyle('backgroundColor', color)}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2">Text Color</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={customStyles.color}
                  onChange={(e) => updateCustomStyle('color', e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => setShowColorPicker(showColorPicker === 'color' ? null : 'color')}
                >
                  Pick
                </Button>
              </div>
              {showColorPicker === 'color' && (
                <div className="mt-2">
                  <HexColorPicker
                    color={customStyles.color}
                    onChange={(color) => updateCustomStyle('color', color)}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2">Border Color</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={customStyles.borderColor}
                  onChange={(e) => updateCustomStyle('borderColor', e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => setShowColorPicker(showColorPicker === 'borderColor' ? null : 'borderColor')}
                >
                  Pick
                </Button>
              </div>
              {showColorPicker === 'borderColor' && (
                <div className="mt-2">
                  <HexColorPicker
                    color={customStyles.borderColor}
                    onChange={(color) => updateCustomStyle('borderColor', color)}
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="animation" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Bezier Curve X1</label>
              <Slider
                value={[customAnimation.x1]}
                onValueChange={([value]) => updateCustomAnimation('x1', value)}
                min={0}
                max={1}
                step={0.01}
              />
              <span>{customAnimation.x1.toFixed(2)}</span>
            </div>
            <div>
              <label className="block mb-2">Bezier Curve Y1</label>
              <Slider
                value={[customAnimation.y1]}
                onValueChange={([value]) => updateCustomAnimation('y1', value)}
                min={0}
                max={1}
                step={0.01}
              />
              <span>{customAnimation.y1.toFixed(2)}</span>
            </div>
            <div>
              <label className="block mb-2">Bezier Curve X2</label>
              <Slider
                value={[customAnimation.x2]}
                onValueChange={([value]) => updateCustomAnimation('x2', value)}
                min={0}
                max={1}
                step={0.01}
              />
              <span>{customAnimation.x2.toFixed(2)}</span>
            </div>
            <div>
              <label className="block mb-2">Bezier Curve Y2</label>
              <Slider
                value={[customAnimation.y2]}
                onValueChange={([value]) => updateCustomAnimation('y2', value)}
                min={0}
                max={1}
                step={0.01}
              />
              <span>{customAnimation.y2.toFixed(2)}</span>
            </div>
          </div>
          <div className="w-full h-64 bg-gray-100 rounded-lg relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d={`M0,100 C${customAnimation.x1 * 100},${100 - customAnimation.y1 * 100} ${customAnimation.x2 * 100},${100 - customAnimation.y2 * 100} 100,0`}
                fill="none"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4">
        <Button onClick={showToast}>Show Toast</Button>
        
        <div className="flex items-center space-x-4">
          <Button onClick={toggleInterval}>
            {intervalId ? 'Stop Interval' : 'Start Interval'}
          </Button>
          <Slider
            value={[intervalDuration]}
            onValueChange={([value]) => setIntervalDuration(value)}
            min={1}
            max={60}
            step={1}
            className="w-64"
          />
          <span>{intervalDuration} seconds</span>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Generated Code</h2>
        <CodeBlock
          code={generateCodeSnippet()}
          language="typescript"
          showLineNumbers={false}
        />
      </div>
      
      <Toaster />
    </div>
  )
}
