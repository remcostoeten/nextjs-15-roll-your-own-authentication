"use client"

import { useEffect, useState, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Heading, Text, Flex } from "@/shared/components/core"
import { parseColorVariables } from "@/modules/(demos)/colors/helpers/color-parser"
import { ColorShowcase } from "@/modules/(demos)/colors/components/color-showcase"
import MatrixGrid from "@/components/matrix-grid/matrix-grid"
import {
    Palette,
    Type,
    Layout,
    Component,
    ChevronRight,
    Menu
} from "lucide-react"
import { cn } from "@/shared/utils/cn"

// Styleguide sections
const sections = [
    { id: "colors", label: "Colors", icon: <Palette className="h-5 w-5" /> },
    { id: "typography", label: "Typography", icon: <Type className="h-5 w-5" /> },
    { id: "layout", label: "Layout", icon: <Layout className="h-5 w-5" /> },
    { id: "components", label: "Components", icon: <Component className="h-5 w-5" /> },
]

function StyleguideContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [activeSection, setActiveSection] = useState(searchParams.get("section") || "colors")
    const [colors, setColors] = useState<any[]>([])
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

    useEffect(() => {
        const fetchColors = async () => {
            const colorData = await parseColorVariables()
            setColors(colorData)
        }

        fetchColors()
    }, [])

    // Update URL when section changes
    const handleSectionChange = (section: string) => {
        setActiveSection(section)
        router.push(`/styleguide?section=${section}`, { scroll: false })
        setIsMobileNavOpen(false)
    }

    return (
        <div className="relative pb-20">
            {/* Matrix grid background effect similar to homepage */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <MatrixGrid />
            </div>

            {/* Hero section */}
            <section className="relative pt-16 pb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Heading level="h1" className="text-5xl md:text-6xl font-bold mb-4">
                        Design System
                    </Heading>
                    <Text variant="lead" className="max-w-2xl mx-auto opacity-80">
                        Explore our design system components, typography, colors, and layout guidelines
                        for building consistent user interfaces.
                    </Text>
                </motion.div>
            </section>

            {/* Main content section with sidebar navigation */}
            <Flex className="relative z-10 mt-8">
                {/* Mobile navigation toggle */}
                <button
                    className="md:hidden fixed top-24 right-4 z-30 bg-background-lighter border border-button-border rounded-full p-2"
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                >
                    <Menu className="h-5 w-5 text-title-light" />
                </button>

                {/* Sidebar navigation */}
                <aside
                    className={cn(
                        "md:w-64 md:sticky md:top-24 md:self-start md:h-[calc(100vh-6rem)] md:overflow-y-auto md:pr-4 transition-all duration-300 ease-in-out",
                        "fixed inset-y-0 left-0 z-20 w-64 bg-background border-r border-button-border md:border-r-0 md:bg-transparent md:translate-x-0 md:opacity-100",
                        isMobileNavOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:opacity-100"
                    )}
                >
                    <nav className="p-4 md:p-0">
                        <Heading level="h2" className="text-xl mb-4 md:hidden">Navigation</Heading>
                        <ul className="space-y-1">
                            {sections.map((section) => (
                                <li key={section.id}>
                                    <button
                                        onClick={() => handleSectionChange(section.id)}
                                        className={cn(
                                            "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-left",
                                            activeSection === section.id
                                                ? "bg-background-lighter text-title-light border-l-2 border-title-light pl-[10px]"
                                                : "text-button hover:text-title-light hover:bg-background-lighter/50"
                                        )}
                                    >
                                        {section.icon}
                                        <span>{section.label}</span>
                                        {activeSection === section.id && (
                                            <ChevronRight className="h-4 w-4 ml-auto" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main content */}
                <div className="flex-1 md:pl-8">
                    {/* Colors Section */}
                    {activeSection === "colors" && (
                        <StyleguideSection
                            title="Color System"
                            description="Our color system is built around a dark theme with carefully selected accent colors that create a sleek, modern interface."
                        >
                            <ColorShowcase colors={colors} />
                        </StyleguideSection>
                    )}

                    {/* Typography Section */}
                    {activeSection === "typography" && (
                        <StyleguideSection
                            title="Typography"
                            description="Our typography system provides consistent text styles for various purposes, from headings to body text."
                        >
                            <Flex direction="col" gap={8} className="w-full">
                                {/* Heading Showcase */}
                                <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                    <Heading level="h3" hasMargin={true}>Heading Components</Heading>
                                    <Flex direction="col" gap={4}>
                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Heading level="h1" hasMargin={false}>Heading 1</Heading>
                                            <Text variant="muted">Used for main page titles</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Heading level="h1">Heading 1</Heading>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Heading level="h2" hasMargin={false}>Heading 2</Heading>
                                            <Text variant="muted">Used for section titles</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Heading level="h2">Heading 2</Heading>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Heading level="h3" hasMargin={false}>Heading 3</Heading>
                                            <Text variant="muted">Used for subsection titles</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Heading level="h3">Heading 3</Heading>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Heading level="h4" hasMargin={false}>Heading 4</Heading>
                                            <Text variant="muted">Used for card titles and smaller sections</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Heading level="h4">Heading 4</Heading>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Heading level="h5" hasMargin={false}>Heading 5</Heading>
                                            <Text variant="muted">Used for smaller titles</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Heading level="h5">Heading 5</Heading>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1}>
                                            <Heading level="h6" hasMargin={false}>Heading 6</Heading>
                                            <Text variant="muted">Used for the smallest titles</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Heading level="h6">Heading 6</Heading>'}
                                            </code>
                                        </Flex>
                                    </Flex>
                                </div>

                                {/* Text Variants Showcase */}
                                <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                    <Heading level="h3" hasMargin={true}>Text Components</Heading>
                                    <Flex direction="col" gap={4}>
                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Text variant="default">Default Text</Text>
                                            <Text variant="muted">Standard paragraph text</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Text variant="default">Default Text</Text>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Text variant="lead">Lead Text</Text>
                                            <Text variant="muted">Used for introductory paragraphs</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Text variant="lead">Lead Text</Text>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Text variant="large">Large Text</Text>
                                            <Text variant="muted">Used for highlighting important information</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Text variant="large">Large Text</Text>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Text variant="muted">Muted Text</Text>
                                            <Text variant="muted">Used for secondary information</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Text variant="muted">Muted Text</Text>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Text variant="small">Small Text</Text>
                                            <Text variant="muted">Used for labels and small text</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Text variant="small">Small Text</Text>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1}>
                                            <Text variant="subtle">Subtle Text</Text>
                                            <Text variant="muted">Used for less important information</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Text variant="subtle">Subtle Text</Text>'}
                                            </code>
                                        </Flex>
                                    </Flex>
                                </div>

                                {/* Link and Special Variants */}
                                <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                    <Heading level="h3" hasMargin={true}>Special Typography</Heading>
                                    <Flex direction="col" gap={4}>
                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Heading level="h4" hasLink linkHref="#" hasMargin={false}>Linked Heading</Heading>
                                            <Text variant="muted">Headings with links</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Heading level="h4" hasLink linkHref="#">Linked Heading</Heading>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Text hasLink linkHref="#">Linked Text</Text>
                                            <Text variant="muted">Text with links</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Text hasLink linkHref="#">Linked Text</Text>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1} className="pb-4 border-b border-button-border">
                                            <Heading level="h4" iconBefore={<Palette className="h-4 w-4" />} hasMargin={false}>
                                                Icon Before Text
                                            </Heading>
                                            <Text variant="muted">Headings with icons before the text</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Heading level="h4" iconBefore={<Palette />}>Icon Before Text</Heading>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={1}>
                                            <Heading level="h4" iconAfter={<ChevronRight className="h-4 w-4" />} hasMargin={false}>
                                                Icon After Text
                                            </Heading>
                                            <Text variant="muted">Headings with icons after the text</Text>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Heading level="h4" iconAfter={<ChevronRight />}>Icon After Text</Heading>'}
                                            </code>
                                        </Flex>
                                    </Flex>
                                </div>
                            </Flex>
                        </StyleguideSection>
                    )}

                    {/* Layout Section */}
                    {activeSection === "layout" && (
                        <StyleguideSection
                            title="Layout Components"
                            description="Our layout components provide flexible and powerful ways to structure your UI."
                        >
                            <Flex direction="col" gap={8} className="w-full">
                                {/* Flex Component Showcase */}
                                <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                    <Heading level="h3" hasMargin={true}>Flex Component</Heading>
                                    <Flex direction="col" gap={6}>
                                        <Flex direction="col" gap={2}>
                                            <Heading level="h4" hasMargin={false}>Row Layout (Default)</Heading>
                                            <Flex items="center" justify="between" className="bg-background p-4 rounded border border-button-border">
                                                <div className="h-16 w-16 bg-button flex items-center justify-center border border-button-border rounded">Item 1</div>
                                                <div className="h-16 w-16 bg-button flex items-center justify-center border border-button-border rounded">Item 2</div>
                                                <div className="h-16 w-16 bg-button flex items-center justify-center border border-button-border rounded">Item 3</div>
                                            </Flex>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Flex items="center" justify="between">...</Flex>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={2}>
                                            <Heading level="h4" hasMargin={false}>Column Layout</Heading>
                                            <Flex direction="col" gap={2} className="bg-background p-4 rounded border border-button-border">
                                                <div className="h-12 bg-button flex items-center justify-center border border-button-border rounded">Item 1</div>
                                                <div className="h-12 bg-button flex items-center justify-center border border-button-border rounded">Item 2</div>
                                                <div className="h-12 bg-button flex items-center justify-center border border-button-border rounded">Item 3</div>
                                            </Flex>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Flex direction="col" gap={2}>...</Flex>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={2}>
                                            <Heading level="h4" hasMargin={false}>Wrapped Items</Heading>
                                            <Flex wrap="wrap" gap={2} className="bg-background p-4 rounded border border-button-border">
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                                    <div key={num} className="h-12 w-20 bg-button flex items-center justify-center border border-button-border rounded">
                                                        Item {num}
                                                    </div>
                                                ))}
                                            </Flex>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<Flex wrap="wrap" gap={2}>...</Flex>'}
                                            </code>
                                        </Flex>
                                    </Flex>
                                </div>

                                {/* Grid Layout Examples */}
                                <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                    <Heading level="h3" hasMargin={true}>Grid Layout</Heading>
                                    <Flex direction="col" gap={6}>
                                        <Flex direction="col" gap={2}>
                                            <Heading level="h4" hasMargin={false}>Basic Grid</Heading>
                                            <div className="grid grid-cols-3 gap-4 bg-background p-4 rounded border border-button-border">
                                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                                    <div key={num} className="h-16 bg-button flex items-center justify-center border border-button-border rounded">
                                                        Item {num}
                                                    </div>
                                                ))}
                                            </div>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<div className="grid grid-cols-3 gap-4">...</div>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={2}>
                                            <Heading level="h4" hasMargin={false}>Responsive Grid</Heading>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-background p-4 rounded border border-button-border">
                                                {[1, 2, 3, 4].map((num) => (
                                                    <div key={num} className="h-16 bg-button flex items-center justify-center border border-button-border rounded">
                                                        Item {num}
                                                    </div>
                                                ))}
                                            </div>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">...</div>'}
                                            </code>
                                        </Flex>

                                        <Flex direction="col" gap={2}>
                                            <Heading level="h4" hasMargin={false}>Grid with Spanning Items</Heading>
                                            <div className="grid grid-cols-3 gap-4 bg-background p-4 rounded border border-button-border">
                                                <div className="h-16 col-span-2 bg-button flex items-center justify-center border border-button-border rounded">
                                                    Span 2
                                                </div>
                                                <div className="h-16 bg-button flex items-center justify-center border border-button-border rounded">
                                                    Item
                                                </div>
                                                <div className="h-16 bg-button flex items-center justify-center border border-button-border rounded">
                                                    Item
                                                </div>
                                                <div className="h-16 col-span-2 bg-button flex items-center justify-center border border-button-border rounded">
                                                    Span 2
                                                </div>
                                            </div>
                                            <code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
                                                {'<div className="col-span-2">Span 2</div>'}
                                            </code>
                                        </Flex>
                                    </Flex>
                                </div>
                            </Flex>
                        </StyleguideSection>
                    )}

                    {/* Components Section */}
                    {activeSection === "components" && (
                        <StyleguideSection
                            title="UI Components"
                            description="Our UI components are designed to be flexible, accessible, and easy to use."
                        >
                            <Flex direction="col" gap={8} className="w-full">
                                <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                    <Heading level="h3" hasMargin={true}>Buttons</Heading>
                                    <Flex direction="col" gap={6}>
                                        <Flex wrap="wrap" gap={3} className="pb-4 border-b border-button-border">
                                            <button className="bg-button border border-button-border text-button hover:text-title-light hover:bg-background transition-colors px-4 py-2 rounded-md">
                                                Default Button
                                            </button>
                                            <button className="border border-button-border text-title-light hover:bg-button/20 hover:border-title-light/30 transition-all px-4 py-2 rounded-md">
                                                Outline Button
                                            </button>
                                            <button className="text-button hover:text-title-light hover:bg-button/20 transition-colors px-4 py-2 rounded-md">
                                                Ghost Button
                                            </button>
                                        </Flex>

                                        <code className="text-xs bg-background px-2 py-1 rounded text-button">
                                            {'<button className="bg-button border border-button-border text-button">Default Button</button>'}
                                        </code>
                                    </Flex>
                                </div>

                                <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                    <Heading level="h3" hasMargin={true}>Cards</Heading>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-background-lighter border border-button-border rounded-lg overflow-hidden">
                                            <div className="h-32 bg-background flex items-center justify-center">
                                                Image Placeholder
                                            </div>
                                            <div className="p-4">
                                                <Heading level="h4" hasMargin={true}>Card Title</Heading>
                                                <Text variant="muted">Card description text that explains the content of the card.</Text>
                                                <Flex items="center" justify="end" className="mt-4">
                                                    <button className="text-button hover:text-title-light text-sm">View More</button>
                                                </Flex>
                                            </div>
                                        </div>

                                        <div className="bg-background-lighter border border-button-border rounded-lg p-4">
                                            <Heading level="h4" hasMargin={true}>Simple Card</Heading>
                                            <Text variant="muted">A simple card without an image for displaying content.</Text>
                                            <div className="mt-4 pt-4 border-t border-button-border">
                                                <Flex items="center" justify="between">
                                                    <Text variant="small">Footer Info</Text>
                                                    <button className="text-button hover:text-title-light text-sm">Action</button>
                                                </Flex>
                                            </div>
                                        </div>

                                        <div className="bg-background-lighter border border-button-border rounded-lg overflow-hidden">
                                            <div className="p-4">
                                                <Flex items="center" gap={3} className="mb-3">
                                                    <div className="h-10 w-10 rounded-full bg-button flex items-center justify-center">
                                                        UA
                                                    </div>
                                                    <div>
                                                        <Text size="sm" weight="medium">User Name</Text>
                                                        <Text variant="subtle">Position</Text>
                                                    </div>
                                                </Flex>
                                                <Text variant="muted">A user card showing profile information and actions.</Text>
                                            </div>
                                            <div className="px-4 py-2 bg-background border-t border-button-border">
                                                <Flex items="center" justify="end" gap={2}>
                                                    <button className="text-button hover:text-title-light text-sm">Message</button>
                                                    <button className="text-button hover:text-title-light text-sm">Profile</button>
                                                </Flex>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-button-border rounded-lg p-6 bg-background-lighter">
                                    <Heading level="h3" hasMargin={true}>Navigation</Heading>
                                    <Flex direction="col" gap={4}>
                                        <div className="border border-button-border rounded-lg overflow-hidden">
                                            <Flex items="center" justify="between" className="p-4 bg-background-lighter">
                                                <Heading level="h4" hasMargin={false}>Navbar Example</Heading>
                                                <Flex items="center" gap={4}>
                                                    <Link href="#" className="text-button hover:text-title-light">Home</Link>
                                                    <Link href="#" className="text-button hover:text-title-light">About</Link>
                                                    <Link href="#" className="text-button hover:text-title-light">Contact</Link>
                                                </Flex>
                                            </Flex>
                                        </div>

                                        <div className="border border-button-border rounded-lg overflow-hidden">
                                            <Tabs defaultValue="tab1" className="w-full">
                                                <TabsList className="bg-button border border-button-border w-full">
                                                    <TabsTrigger
                                                        value="tab1"
                                                        className="flex-1 data-[state=active]:bg-background-lighter data-[state=active]:text-title-light text-button"
                                                    >
                                                        Tab 1
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="tab2"
                                                        className="flex-1 data-[state=active]:bg-background-lighter data-[state=active]:text-title-light text-button"
                                                    >
                                                        Tab 2
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="tab3"
                                                        className="flex-1 data-[state=active]:bg-background-lighter data-[state=active]:text-title-light text-button"
                                                    >
                                                        Tab 3
                                                    </TabsTrigger>
                                                </TabsList>
                                                <div className="p-4 bg-background-lighter">
                                                    <Text>Tab content would appear here</Text>
                                                </div>
                                            </Tabs>
                                        </div>
                                    </Flex>
                                </div>
                            </Flex>
                        </StyleguideSection>
                    )}
                </div>
            </Flex>
        </div>
    )
}

export default function StyleguidePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StyleguideContent />
        </Suspense>
    )
}

// Section component for consistent formatting
function StyleguideSection({
    title,
    description,
    children
}: {
    title: string
    description: string
    children: React.ReactNode
}) {
    return (
        <section className="mb-10">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
            >
                <Heading level="h2" hasMargin={true} className="text-3xl">
                    {title}
                </Heading>
                <Text variant="muted" className="max-w-3xl">
                    {description}
                </Text>
            </motion.div>
            {children}
        </section>
    )
} 