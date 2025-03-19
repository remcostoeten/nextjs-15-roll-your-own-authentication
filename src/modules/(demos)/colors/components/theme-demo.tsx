"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trash2, Sun, Eye, RotateCcw, FileText, ChevronRight, MoreHorizontal, Database, Key } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/components/ui/hover-card"
import { Slider } from "@/shared/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import type { ColorVariable } from "@/modules/(demos)/colors/types"

interface ColorInfo {
    element: string
    cssVar: string
    value: string
}

interface ThemeDemoPanelProps {
    colors: ColorVariable[]
}

export function ThemeDemoPanel({ colors }: ThemeDemoPanelProps) {
    const [opacity, setOpacity] = useState(100)
    const [activeTab, setActiveTab] = useState("local")

    // Create a mapping of CSS variables to their values
    const colorMap = colors.reduce(
        (acc, color) => {
            acc[`--${color.name}`] = color.value
            return acc
        },
        {} as Record<string, string>,
    )

    // Helper function to create hover elements
    const ColorElement = ({ element, cssVar, value }: ColorInfo) => (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className={element}>{element.includes("text") ? null : element}</div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-background-lighter border light-border">
                <div className="flex justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-title-light">CSS Variable</h4>
                        <p className="text-xs text-button">var({cssVar})</p>
                    </div>
                    <div className="h-8 w-8 rounded border border-button-border" style={{ backgroundColor: value }} />
                </div>
                <div className="mt-2">
                    <h4 className="text-sm font-semibold text-title-light">Hex Value</h4>
                    <p className="text-xs text-button">{value}</p>
                </div>
                <div className="mt-2">
                    <h4 className="text-sm font-semibold text-title-light">Applied to</h4>
                    <p className="text-xs text-button">{element}</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto rounded-lg overflow-hidden border border-button-border bg-panel"
        >
            <div className="flex items-center justify-between p-4 border-b border-button-border">
                <ColorElement
                    element="text-title-light text-lg font-medium"
                    cssVar="--title-light"
                    value={colorMap["--title-light"] || "#f5f4f4"}
                >
                    Developer Tools
                </ColorElement>
                <Button variant="ghost" size="icon" className="text-button hover:text-title-light">
                    <ColorElement element="text-button" cssVar="--text-button" value={colorMap["--text-button"] || "#8d877c"}>
                        ×
                    </ColorElement>
                </Button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
                <ColorElement
                    element="bg-button border border-button-border rounded p-2 flex items-center justify-center gap-2 text-button"
                    cssVar="--button"
                    value={colorMap["--button"] || "#19191b"}
                >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Local Storage</span>
                </ColorElement>

                <ColorElement
                    element="bg-button border border-button-border rounded p-2 flex items-center justify-center gap-2 text-button"
                    cssVar="--button"
                    value={colorMap["--button"] || "#19191b"}
                >
                    <Sun className="h-4 w-4" />
                    <span>Toggle Theme</span>
                </ColorElement>

                <ColorElement
                    element="bg-button border border-button-border rounded p-2 flex items-center justify-center gap-2 text-button"
                    cssVar="--button"
                    value={colorMap["--button"] || "#19191b"}
                >
                    <Eye className="h-4 w-4" />
                    <span>Toggle Visibility</span>
                </ColorElement>

                <ColorElement
                    element="bg-button border border-button-border rounded p-2 flex items-center justify-center gap-2 text-button"
                    cssVar="--button"
                    value={colorMap["--button"] || "#19191b"}
                >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset Position</span>
                </ColorElement>

                <ColorElement
                    element="bg-button border border-button-border rounded p-2 flex items-center justify-center gap-2 text-button col-span-2"
                    cssVar="--button"
                    value={colorMap["--button"] || "#19191b"}
                >
                    <FileText className="h-4 w-4" />
                    <span>Toggle Debug Info</span>
                </ColorElement>
            </div>

            <ColorElement
                element="bg-panel border border-button-border rounded-md p-4 mx-4 mb-4"
                cssVar="--panel"
                value={colorMap["--panel"] || "#19191b"}
            >
                <h3 className="text-title-light text-lg font-medium mb-4">Widget Settings</h3>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-button">Opacity</span>
                    <div className="flex items-center gap-2">
                        <span className="text-button">{opacity}%</span>
                        <div className="h-4 w-4 rounded-full bg-offwhite"></div>
                    </div>
                </div>

                <Slider
                    value={[opacity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setOpacity(value[0])}
                    className="mb-6"
                />

                <div>
                    <span className="text-button mb-2 block">Position</span>
                    <div className="grid grid-cols-2 gap-3">
                        <ColorElement
                            element="bg-button border border-button-border rounded p-2 flex items-center justify-center gap-2 text-button"
                            cssVar="--button"
                            value={colorMap["--button"] || "#19191b"}
                        >
                            <span>Top Left</span>
                        </ColorElement>

                        <ColorElement
                            element="bg-button border border-button-border rounded p-2 flex items-center justify-center gap-2 text-button"
                            cssVar="--button"
                            value={colorMap["--button"] || "#19191b"}
                        >
                            <span>Top Right</span>
                        </ColorElement>

                        <ColorElement
                            element="bg-button border border-button-border rounded p-2 flex items-center justify-center gap-2 text-button"
                            cssVar="--button"
                            value={colorMap["--button"] || "#19191b"}
                        >
                            <span>Bottom Left</span>
                        </ColorElement>

                        <ColorElement
                            element="bg-button border border-button-border rounded p-2 flex items-center justify-center gap-2 text-button"
                            cssVar="--button"
                            value={colorMap["--button"] || "#19191b"}
                        >
                            <span>Bottom Right</span>
                        </ColorElement>
                    </div>
                </div>
            </ColorElement>

            <ColorElement
                element="bg-bg text-center p-3 mx-4 mb-4 rounded text-button"
                cssVar="--background"
                value={colorMap["--background"] || "#08080b"}
            >
                Theme changed to dark
            </ColorElement>

            <div className="px-4 mb-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-button border border-button-border">
                        <TabsTrigger
                            value="local"
                            className={`data-[state=active]:bg-panel data-[state=active]:text-title-light text-button`}
                        >
                            <Database className="h-4 w-4 mr-2" />
                            Local Storage
                        </TabsTrigger>
                        <TabsTrigger
                            value="session"
                            className={`data-[state=active]:bg-panel data-[state=active]:text-title-light text-button`}
                        >
                            <Database className="h-4 w-4 mr-2" />
                            Session Storage
                        </TabsTrigger>
                        <TabsTrigger
                            value="jwt"
                            className={`data-[state=active]:bg-panel data-[state=active]:text-title-light text-button`}
                        >
                            <Key className="h-4 w-4 mr-2" />
                            JWT
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="px-4 mb-4 grid grid-cols-5 gap-2">
                <Input
                    placeholder="Key"
                    className="col-span-2 bg-button border-button-border text-button placeholder:text-button/50"
                />
                <Input
                    placeholder="Value"
                    className="col-span-2 bg-button border-button-border text-button placeholder:text-button/50"
                />
                <Button className="bg-button border border-button-border text-button hover:text-title-light">+</Button>
            </div>

            <div className="px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
                {["theme", "dev-tools-settings", "floating-todo-storage"].map((item) => (
                    <ColorElement
                        key={item}
                        element="bg-button border border-button-border rounded p-3 flex items-center justify-between text-button"
                        cssVar="--button"
                        value={colorMap["--button"] || "#19191b"}
                    >
                        <div className="flex items-center">
                            <ChevronRight className="h-4 w-4 mr-2" />
                            <span>{item}</span>
                        </div>
                        <MoreHorizontal className="h-4 w-4" />
                    </ColorElement>
                ))}
            </div>
        </motion.div>
    )
}

