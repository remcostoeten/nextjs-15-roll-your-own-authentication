"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Palette, Copy, Check, Sun, Moon } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import type { ColorVariable } from "@/modules/(demos)/colors/types"

interface ColorShowcaseProps {
    colors: ColorVariable[]
}

export function ColorShowcase({ colors }: ColorShowcaseProps) {
    const [copiedColor, setCopiedColor] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'colors' | 'usage'>('colors')

    const handleCopyColor = (value: string) => {
        navigator.clipboard.writeText(value)
        setCopiedColor(value)
        setTimeout(() => setCopiedColor(null), 2000)
    }

    const colorsByCategory = colors.reduce((acc, color) => {
        const category = color.name.includes('background')
            ? 'backgrounds'
            : color.name.includes('button')
                ? 'buttons'
                : color.name.includes('title') || color.name.includes('text')
                    ? 'text'
                    : 'others'

        if (!acc[category]) {
            acc[category] = []
        }

        acc[category].push(color)
        return acc
    }, {} as Record<string, ColorVariable[]>)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-button-border bg-background"
        >
            <div className="flex items-center justify-between p-4 border-b border-button-border bg-background-lighter">
                <div className="flex items-center gap-2 text-title-light">
                    <Palette className="h-5 w-5" />
                    <h2 className="text-lg font-medium">Color System</h2>
                </div>
                <div className="flex gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1 text-button hover:text-title-light"
                                >
                                    <Sun className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Light Mode (Coming soon)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1 text-button hover:text-title-light"
                                >
                                    <Moon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Dark Mode (Active)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div className="p-6">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'colors' | 'usage')}>
                    <TabsList className="bg-button mb-6 border border-button-border">
                        <TabsTrigger
                            value="colors"
                            className="data-[state=active]:bg-background-lighter data-[state=active]:text-title-light text-button"
                        >
                            Color Palette
                        </TabsTrigger>
                        <TabsTrigger
                            value="usage"
                            className="data-[state=active]:bg-background-lighter data-[state=active]:text-title-light text-button"
                        >
                            Usage Examples
                        </TabsTrigger>
                    </TabsList>

                    {activeTab === 'colors' && (
                        <div className="space-y-8">
                            {Object.entries(colorsByCategory).map(([category, colorList]) => (
                                <div key={category} className="space-y-3">
                                    <h3 className="text-title-light font-medium capitalize">{category}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {colorList.map((color) => (
                                            <HoverCard key={color.name}>
                                                <HoverCardTrigger asChild>
                                                    <div
                                                        className="group border border-button-border p-4 rounded-lg flex items-center gap-4 bg-background-lighter cursor-pointer hover:border-title-light/30 transition-colors"
                                                        onClick={() => handleCopyColor(color.value)}
                                                    >
                                                        <div
                                                            className="h-12 w-12 rounded-md border border-button-border"
                                                            style={{ backgroundColor: color.value }}
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-title-light text-sm">--{color.name}</p>
                                                            <p className="text-text-button text-xs">{color.value}</p>
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {copiedColor === color.value ? (
                                                                <Check className="h-4 w-4 text-title-light" />
                                                            ) : (
                                                                <Copy className="h-4 w-4 text-button" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-80 bg-background-lighter border border-button-border">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-title-light">CSS Variable</h4>
                                                            <code className="text-xs bg-background px-1 py-0.5 rounded text-button">var(--{color.name})</code>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-title-light">Available Classes</h4>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {color.classes.map((className) => (
                                                                    <code key={className} className="text-xs bg-background px-1 py-0.5 rounded text-button">
                                                                        {className}
                                                                    </code>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full text-xs mt-2 hover:bg-background hover:text-title-light"
                                                                onClick={() => handleCopyColor(color.value)}
                                                            >
                                                                {copiedColor === color.value ? 'Copied!' : 'Copy HEX Value'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'usage' && (
                        <div className="grid gap-6">
                            <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                <h3 className="text-title-light font-medium mb-4">Text & Typography</h3>
                                <div className="space-y-2">
                                    <p className="text-title-light text-lg">Primary Text (--title-light)</p>
                                    <p className="text-button">Secondary Text (--text-button)</p>
                                </div>
                            </div>

                            <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                <h3 className="text-title-light font-medium mb-4">Buttons & Interactive Elements</h3>
                                <div className="flex flex-wrap gap-3">
                                    <Button className="bg-button border border-button-border text-button hover:text-title-light">
                                        Default Button
                                    </Button>
                                    <Button variant="outline" className="border-button-border text-title-light">
                                        Outline Button
                                    </Button>
                                    <Button variant="ghost" className="text-button hover:text-title-light">
                                        Ghost Button
                                    </Button>
                                </div>
                            </div>

                            <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                <h3 className="text-title-light font-medium mb-4">Background Elements</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="h-24 rounded-lg border border-button-border bg-background p-4">
                                        <span className="text-title-light text-sm">Background (--background)</span>
                                    </div>
                                    <div className="h-24 rounded-lg border border-button-border bg-background-lighter p-4">
                                        <span className="text-title-light text-sm">Background Lighter (--background-lighter)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Tabs>
            </div>
        </motion.div>
    )
} 