"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Palette, Copy, Check, Sun, Moon, Code } from "lucide-react"
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
    const [copiedClass, setCopiedClass] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'colors' | 'usage'>('colors')

    const handleCopyColor = (value: string) => {
        navigator.clipboard.writeText(value)
        setCopiedColor(value)
        setTimeout(() => setCopiedColor(null), 2000)
    }

    const handleCopyClass = (className: string) => {
        navigator.clipboard.writeText(className)
        setCopiedClass(className)
        setTimeout(() => setCopiedClass(null), 2000)
    }

    // Generate Tailwind classes for each color
    const enhanceColorWithClasses = (color: ColorVariable) => {
        const tailwindClasses = [];
        const name = color.name;

        // Add background class
        if (name.includes('background') || name.includes('button') || name === 'offblack' || name === 'offwhite' || name === 'panel') {
            tailwindClasses.push(`bg-${name.replace('--', '')}`);
        }

        // Add text class
        if (name.includes('text') || name.includes('title') || name === 'offwhite' || name === 'offblack') {
            tailwindClasses.push(`text-${name.replace('--', '')}`);
        }

        // Add border class
        if (name.includes('border') || name === 'button-border') {
            tailwindClasses.push(`border-${name.replace('--', '')}`);
        }

        return {
            ...color,
            tailwindClasses
        };
    };

    const enhancedColors = colors.map(enhanceColorWithClasses);

    const colorsByCategory = enhancedColors.reduce((acc, color) => {
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
    }, {} as Record<string, ReturnType<typeof enhanceColorWithClasses>[]>)

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
                                                <HoverCardContent className="w-96 bg-background-lighter border border-button-border">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-title-light">CSS Variable</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <code className="flex-1 text-xs bg-background px-1 py-0.5 rounded text-button">var(--{color.name})</code>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-6 w-6 p-0"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCopyColor(`var(--${color.name})`);
                                                                    }}
                                                                >
                                                                    {copiedColor === `var(--${color.name})` ? (
                                                                        <Check className="h-3 w-3 text-title-light" />
                                                                    ) : (
                                                                        <Copy className="h-3 w-3 text-button" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-medium text-title-light">Hex Value</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <code className="flex-1 text-xs bg-background px-1 py-0.5 rounded text-button">{color.value}</code>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-6 w-6 p-0"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCopyColor(color.value);
                                                                    }}
                                                                >
                                                                    {copiedColor === color.value ? (
                                                                        <Check className="h-3 w-3 text-title-light" />
                                                                    ) : (
                                                                        <Copy className="h-3 w-3 text-button" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Tailwind Classes */}
                                                        <div>
                                                            <h4 className="text-sm font-medium text-title-light mb-2">Tailwind Classes</h4>
                                                            <div className="space-y-2">
                                                                {color.tailwindClasses.filter(cls => cls.startsWith('bg-')).length > 0 && (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex-shrink-0 w-20 text-xs text-button">Background:</div>
                                                                        <div className="flex flex-wrap gap-1 flex-1">
                                                                            {color.tailwindClasses.filter(cls => cls.startsWith('bg-')).map(className => (
                                                                                <div key={className} className="flex items-center bg-background rounded">
                                                                                    <code className="text-xs px-1 py-0.5 text-button">{className}</code>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="ghost"
                                                                                        className="h-6 w-6 p-0 ml-1"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleCopyClass(className);
                                                                                        }}
                                                                                    >
                                                                                        {copiedClass === className ? (
                                                                                            <Check className="h-3 w-3 text-title-light" />
                                                                                        ) : (
                                                                                            <Copy className="h-3 w-3 text-button" />
                                                                                        )}
                                                                                    </Button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {color.tailwindClasses.filter(cls => cls.startsWith('text-')).length > 0 && (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex-shrink-0 w-20 text-xs text-button">Text:</div>
                                                                        <div className="flex flex-wrap gap-1 flex-1">
                                                                            {color.tailwindClasses.filter(cls => cls.startsWith('text-')).map(className => (
                                                                                <div key={className} className="flex items-center bg-background rounded">
                                                                                    <code className="text-xs px-1 py-0.5 text-button">{className}</code>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="ghost"
                                                                                        className="h-6 w-6 p-0 ml-1"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleCopyClass(className);
                                                                                        }}
                                                                                    >
                                                                                        {copiedClass === className ? (
                                                                                            <Check className="h-3 w-3 text-title-light" />
                                                                                        ) : (
                                                                                            <Copy className="h-3 w-3 text-button" />
                                                                                        )}
                                                                                    </Button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {color.tailwindClasses.filter(cls => cls.startsWith('border-')).length > 0 && (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex-shrink-0 w-20 text-xs text-button">Border:</div>
                                                                        <div className="flex flex-wrap gap-1 flex-1">
                                                                            {color.tailwindClasses.filter(cls => cls.startsWith('border-')).map(className => (
                                                                                <div key={className} className="flex items-center bg-background rounded">
                                                                                    <code className="text-xs px-1 py-0.5 text-button">{className}</code>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="ghost"
                                                                                        className="h-6 w-6 p-0 ml-1"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleCopyClass(className);
                                                                                        }}
                                                                                    >
                                                                                        {copiedClass === className ? (
                                                                                            <Check className="h-3 w-3 text-title-light" />
                                                                                        ) : (
                                                                                            <Copy className="h-3 w-3 text-button" />
                                                                                        )}
                                                                                    </Button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Available Classes */}
                                                        <div>
                                                            <h4 className="text-sm font-medium text-title-light">Available CSS Classes</h4>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {color.classes.map((className) => (
                                                                    <div key={className} className="flex items-center bg-background rounded">
                                                                        <code className="text-xs px-1 py-0.5 text-button">{className}</code>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-6 w-6 p-0 ml-1"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleCopyClass(className.substring(1)); // Remove the dot
                                                                            }}
                                                                        >
                                                                            {copiedClass === className.substring(1) ? (
                                                                                <Check className="h-3 w-3 text-title-light" />
                                                                            ) : (
                                                                                <Copy className="h-3 w-3 text-button" />
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
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