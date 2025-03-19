"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Palette, Copy, Check, Sun, Moon, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { Text, Heading, Flex } from "@/shared/components/core"
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
            <Flex
                items="center"
                justify="between"
                className="p-4 border-b border-button-border bg-background-lighter"
            >
                <Flex items="center" gap={2}>
                    <Palette className="h-5 w-5 text-title-light" />
                    <Heading level="h2" className="text-lg font-medium" hasMargin={false}>Developer Tools</Heading>
                </Flex>
                <Flex gap={2}>
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
                                <Text as="span" size="sm" variant="muted">Light Mode (Coming soon)</Text>
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
                                <Text as="span" size="sm" variant="muted">Dark Mode (Active)</Text>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Flex>
            </Flex>

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
                                    <Heading level="h3" variant="default" hasMargin={false} className="capitalize">{category}</Heading>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {colorList.map((color) => (
                                            <HoverCard key={color.name}>
                                                <HoverCardTrigger asChild>
                                                    <div
                                                        className="group border border-button-border p-4 rounded-lg flex items-center gap-4 bg-background-lighter cursor-pointer hover:border-title-light/20 hover:bg-background-lighter/95 transition-all"
                                                        onClick={() => handleCopyColor(color.value)}
                                                    >
                                                        <div
                                                            className="h-12 w-12 rounded-md border border-button-border shadow-sm group-hover:scale-[1.02] transition-all"
                                                            style={{ backgroundColor: color.value }}
                                                        />
                                                        <Flex direction="col" className="flex-1">
                                                            <Text size="sm">--{color.name}</Text>
                                                            <Text variant="muted" size="xs">{color.value}</Text>
                                                        </Flex>
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
                                                    <Flex direction="col" gap={4}>
                                                        <div>
                                                            <Heading level="h4" className="text-sm font-medium" hasMargin={false}>CSS Variable</Heading>
                                                            <Flex items="center" gap={2} className="mt-1">
                                                                <code className="flex-1 text-xs bg-background px-1 py-0.5 rounded text-button">var(--{color.name})</code>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-6 w-6 p-0 hover:bg-background/30 hover:text-title-light transition-colors"
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
                                                            </Flex>
                                                        </div>

                                                        <div>
                                                            <Heading level="h4" className="text-sm font-medium" hasMargin={false}>Hex Value</Heading>
                                                            <Flex items="center" gap={2} className="mt-1">
                                                                <code className="flex-1 text-xs bg-background px-1 py-0.5 rounded text-button">{color.value}</code>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-6 w-6 p-0 hover:bg-background/30 hover:text-title-light transition-colors"
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
                                                            </Flex>
                                                        </div>

                                                        {/* Tailwind Classes */}
                                                        <div>
                                                            <Heading level="h4" className="text-sm font-medium mb-2" hasMargin={false}>Tailwind Classes</Heading>
                                                            <Flex direction="col" gap={2}>
                                                                {color.tailwindClasses.filter(cls => cls.startsWith('bg-')).length > 0 && (
                                                                    <Flex items="center" gap={2}>
                                                                        <Text variant="muted" size="xs" className="flex-shrink-0 w-20">Background:</Text>
                                                                        <Flex wrap="wrap" gap={1} className="flex-1">
                                                                            {color.tailwindClasses.filter(cls => cls.startsWith('bg-')).map(className => (
                                                                                <Flex key={className} items="center" className="bg-background rounded">
                                                                                    <code className="text-xs px-1 py-0.5 text-button">{className}</code>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="ghost"
                                                                                        className="h-6 w-6 p-0 ml-1 hover:bg-background/30 hover:text-title-light transition-colors"
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
                                                                                </Flex>
                                                                            ))}
                                                                        </Flex>
                                                                    </Flex>
                                                                )}

                                                                {color.tailwindClasses.filter(cls => cls.startsWith('text-')).length > 0 && (
                                                                    <Flex items="center" gap={2}>
                                                                        <Text variant="muted" size="xs" className="flex-shrink-0 w-20">Text:</Text>
                                                                        <Flex wrap="wrap" gap={1} className="flex-1">
                                                                            {color.tailwindClasses.filter(cls => cls.startsWith('text-')).map(className => (
                                                                                <Flex key={className} items="center" className="bg-background rounded">
                                                                                    <code className="text-xs px-1 py-0.5 text-button">{className}</code>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="ghost"
                                                                                        className="h-6 w-6 p-0 ml-1 hover:bg-background/30 hover:text-title-light transition-colors"
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
                                                                                </Flex>
                                                                            ))}
                                                                        </Flex>
                                                                    </Flex>
                                                                )}

                                                                {color.tailwindClasses.filter(cls => cls.startsWith('border-')).length > 0 && (
                                                                    <Flex items="center" gap={2}>
                                                                        <Text variant="muted" size="xs" className="flex-shrink-0 w-20">Border:</Text>
                                                                        <Flex wrap="wrap" gap={1} className="flex-1">
                                                                            {color.tailwindClasses.filter(cls => cls.startsWith('border-')).map(className => (
                                                                                <Flex key={className} items="center" className="bg-background rounded">
                                                                                    <code className="text-xs px-1 py-0.5 text-button">{className}</code>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="ghost"
                                                                                        className="h-6 w-6 p-0 ml-1 hover:bg-background/30 hover:text-title-light transition-colors"
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
                                                                                </Flex>
                                                                            ))}
                                                                        </Flex>
                                                                    </Flex>
                                                                )}
                                                            </Flex>
                                                        </div>

                                                        {/* Available Classes */}
                                                        <div>
                                                            <Heading level="h4" className="text-sm font-medium" hasMargin={false}>Available CSS Classes</Heading>
                                                            <Flex wrap="wrap" gap={1} className="mt-1">
                                                                {color.classes.map((className) => (
                                                                    <Flex key={className} items="center" className="bg-background rounded">
                                                                        <code className="text-xs px-1 py-0.5 text-button">{className}</code>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-6 w-6 p-0 ml-1 hover:bg-background/30 hover:text-title-light transition-colors"
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
                                                                    </Flex>
                                                                ))}
                                                            </Flex>
                                                        </div>
                                                    </Flex>
                                                </HoverCardContent>
                                            </HoverCard>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'usage' && (
                        <Flex direction="col" gap={6}>
                            <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                <Heading level="h3" hasMargin={true}>Text & Typography</Heading>
                                <Flex direction="col" gap={2}>
                                    <Text size="lg">Primary Text (--title-light)</Text>
                                    <Text variant="muted">Secondary Text (--text-button)</Text>
                                </Flex>
                            </div>

                            <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                <Heading level="h3" hasMargin={true}>Buttons & Interactive Elements</Heading>
                                <Flex wrap="wrap" gap={3}>
                                    <Button className="bg-button border border-button-border text-button hover:text-title-light hover:bg-background transition-colors">
                                        Default Button
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-button-border text-title-light hover:bg-button/20 hover:border-title-light/30 transition-all"
                                    >
                                        Outline Button
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="text-button hover:text-title-light hover:bg-button/20 transition-colors"
                                    >
                                        Ghost Button
                                    </Button>
                                </Flex>
                            </div>

                            <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                <Heading level="h3" hasMargin={true}>Background Elements</Heading>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="h-24 rounded-lg border border-button-border bg-background p-4">
                                        <Text size="sm">Background (--background)</Text>
                                    </div>
                                    <div className="h-24 rounded-lg border border-button-border bg-background-lighter p-4">
                                        <Text size="sm">Background Lighter (--background-lighter)</Text>
                                    </div>
                                </div>
                            </div>

                            {/* Add an expandable item example to show the chevron with bg-background */}
                            <div className="border border-button-border rounded-lg overflow-hidden">
                                <Flex items="center" justify="between" className="p-4 bg-background-lighter">
                                    <Heading level="h3" hasMargin={false}>Expandable Item</Heading>
                                    <div className="h-6 w-6 rounded flex items-center justify-center bg-background">
                                        <ChevronRight className="h-4 w-4 text-button" />
                                    </div>
                                </Flex>
                                <div className="p-4 border-t border-button-border">
                                    <Text variant="muted">
                                        This demonstrates the expandable item with a chevron indicator that has bg-background.
                                    </Text>
                                </div>
                            </div>

                            {/* New section to showcase the Text and Heading components */}
                            <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                <Heading level="h3" hasMargin={true}>Core Typography Components</Heading>

                                <Flex direction="col" gap={6}>
                                    <div>
                                        <Heading level="h4" hasMargin={true}>Heading Variants</Heading>
                                        <Flex direction="col" gap={2}>
                                            <Heading level="h1" hasMargin={false}>Heading 1</Heading>
                                            <Heading level="h2" hasMargin={false}>Heading 2</Heading>
                                            <Heading level="h3" hasMargin={false}>Heading 3</Heading>
                                            <Heading level="h4" hasMargin={false}>Heading 4</Heading>
                                            <Heading level="h5" hasMargin={false}>Heading 5</Heading>
                                            <Heading level="h6" hasMargin={false}>Heading 6</Heading>
                                        </Flex>
                                    </div>

                                    <div>
                                        <Heading level="h4" hasMargin={true}>Text Variants</Heading>
                                        <Flex direction="col" gap={2}>
                                            <Text variant="default">Default Text</Text>
                                            <Text variant="muted">Muted Text</Text>
                                            <Text variant="lead">Lead Text</Text>
                                            <Text variant="large">Large Text</Text>
                                            <Text variant="small">Small Text</Text>
                                            <Text variant="subtle">Subtle Text</Text>
                                        </Flex>
                                    </div>

                                    <div>
                                        <Heading level="h4" hasMargin={true}>Linked Headers & Text</Heading>
                                        <Flex direction="col" gap={2}>
                                            <Heading level="h4" hasLink linkHref="#" hasMargin={false}>Linked Heading</Heading>
                                            <Text hasLink linkHref="#" variant="default">Linked Text</Text>
                                            <Heading level="h4" hasLink linkHref="#" isExternal hasMargin={false}>External Link</Heading>
                                        </Flex>
                                    </div>

                                    <div>
                                        <Heading level="h4" hasMargin={true}>Headers with Icons</Heading>
                                        <Flex direction="col" gap={2}>
                                            <Heading
                                                level="h4"
                                                iconBefore={<Palette className="h-4 w-4" />}
                                                hasMargin={false}
                                            >
                                                Icon Before
                                            </Heading>
                                            <Heading
                                                level="h4"
                                                iconAfter={<Copy className="h-4 w-4" />}
                                                hasMargin={false}
                                            >
                                                Icon After
                                            </Heading>
                                        </Flex>
                                    </div>
                                </Flex>
                            </div>

                            {/* Flexbox Demo */}
                            <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                <Heading level="h3" hasMargin={true}>Flex Component</Heading>

                                <Flex direction="col" gap={6}>
                                    <div>
                                        <Heading level="h4" hasMargin={true}>Row with items centered</Heading>
                                        <Flex items="center" justify="between" className="bg-background p-3 rounded">
                                            <Text>Left item</Text>
                                            <Text>Right item</Text>
                                        </Flex>
                                    </div>

                                    <div>
                                        <Heading level="h4" hasMargin={true}>Column with gap</Heading>
                                        <Flex direction="col" gap={2} className="bg-background p-3 rounded">
                                            <Text>First item</Text>
                                            <Text>Second item</Text>
                                            <Text>Third item</Text>
                                        </Flex>
                                    </div>

                                    <div>
                                        <Heading level="h4" hasMargin={true}>Wrapped items</Heading>
                                        <Flex wrap="wrap" gap={2} className="bg-background p-3 rounded">
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <div key={num} className="h-10 w-20 bg-button flex items-center justify-center border border-button-border rounded">
                                                    <Text variant="muted" size="sm">Item {num}</Text>
                                                </div>
                                            ))}
                                        </Flex>
                                    </div>
                                </Flex>
                            </div>
                        </Flex>
                    )}
                </Tabs>
            </div>
        </motion.div>
    )
} 