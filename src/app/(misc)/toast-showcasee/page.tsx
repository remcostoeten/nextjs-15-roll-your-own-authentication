"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from ""
import { CodeBlock } from '@/components/primitives/code-block/code-block'
import { ToastProps, useToast } from '@/components/primitives/toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from 'react'
import { HexColorPicker } from "react-colorful"

type ToastAnimation = 'slide' | 'fade' | 'zoom' | 'bounce' | 'custom'

type Props = {}

export default function AdvancedToastPlayground({ }: Props) {
  const toast = useToast()
  const [toastConfig, setToastConfig] = useState<Partial<ToastProps & { animation: ToastAnimation }>>({
    title: 'Toast Title',
    message: 'This is a toast message',
    description: 'Additional description text',
    variant: 'default',
    position: 'bottom-right',
    duration: 5000,
    animation: 'slide',
    showProgress: true,
    showSpinner: false,
    isPending: false
  })

  const [customStyles, setCustomStyles] = useState({
    borderRadius: '0.5rem',
    backgroundColor: '#18181B',
    color: '#FFFFFF',
    borderColor: '#27272A',
    height: '4rem',
  })

  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)

  const showToast = () => {
    toast[toastConfig.variant as keyof typeof toast](toastConfig.message, {
      ...toastConfig,
      style: {
        ...customStyles,
        border: `1px solid ${customStyles.borderColor}`,
      }
    } as any)
  }

  const showPromiseToast = () => {
    const fakePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject('Error occurred!')
      }, 2000)
    })

    toast.promise(
      fakePromise,
      {
        loading: 'Loading...',
        success: (data) => `Promise resolved: ${data}`,
        error: (err) => `Promise rejected: ${err}`
      },
      {
        ...toastConfig,
        style: {
          ...customStyles,
          border: `1px solid ${customStyles.borderColor}`,
        }
      }
    )
  }

  const updateConfig = (key: keyof ToastProps, value: any) => {
    setToastConfig(prev => ({ ...prev, [key]: value }))
  }

  const updateCustomStyle = (key: keyof typeof customStyles, value: string) => {
    setCustomStyles(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Toast Playground</h1>
        <div className="space-x-2">
          <Button onClick={showToast}>Show Toast</Button>
          <Button variant="outline" onClick={showPromiseToast}>
            Test Promise Toast
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Message</label>
              <Input
                value={toastConfig.message}
                onChange={(e) => updateConfig('message', e.target.value)}
                placeholder="Toast message"
              />
            </div>

            <div className="space-y-2">
              <label>Description</label>
              <Input
                value={toastConfig.description}
                onChange={(e) => updateConfig('description', e.target.value)}
                placeholder="Additional description"
              />
            </div>

            <div className="space-y-2">
              <label>Variant</label>
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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label>Position</label>
              <Select
                value={toastConfig.position}
                onValueChange={(value) => updateConfig('position', value)}
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

            <div className="space-y-2">
              <label>Duration (ms)</label>
              <Input
                type="number"
                value={toastConfig.duration}
                onChange={(e) => updateConfig('duration', Number(e.target.value))}
                min={1000}
                step={500}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={toastConfig.showProgress}
                  onCheckedChange={(checked) => updateConfig('showProgress', checked)}
                />
                <label>Show Progress</label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={toastConfig.showSpinner}
                  onCheckedChange={(checked) => updateConfig('showSpinner', checked)}
                />
                <label>Show Spinner</label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="styling" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(customStyles).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex gap-2">
                  <Input
                    value={value}
                    onChange={(e) => updateCustomStyle(key as keyof typeof customStyles, e.target.value)}
                  />
                  {(key.includes('Color')) && (
                    <Button
                      variant="outline"
                      onClick={() => setShowColorPicker(showColorPicker === key ? null : key)}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: value }}
                      />
                    </Button>
                  )}
                </div>
                {showColorPicker === key && (
                  <div className="absolute mt-2 z-50">
                    <HexColorPicker
                      color={value}
                      onChange={(color) => updateCustomStyle(key as keyof typeof customStyles, color)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="space-y-2">
              <h3 className="font-semibold">Current Configuration</h3>
              <CodeBlock
                code={JSON.stringify({ ...toastConfig, style: customStyles }, null, 2)}
                language="json"
                showLineNumbers={false}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
