'use client'

import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Heading, Text, Flex } from '@/shared/components/core'
import { parseColorVariables } from '@/modules/(demos)/colors/helpers/color-parser'
import { ColorShowcase } from '@/modules/(demos)/colors/components/color-showcase'
import {
	HeadingShowcase,
	TextVariantsShowcase,
	SpecialTypographyShowcase,
	FlexShowcase,
	GridShowcase,
	ButtonShowcase,
	CardShowcase,
	NavigationShowcase,
} from '@/modules/(demos)/styleguide/components/showcases'
import {
	Palette,
	Type,
	Layout,
	Component,
	ChevronRight,
	Menu,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'

// Types
type Section = {
	id: string
	label: string
	icon: React.ReactNode
	component: React.ReactNode
}

type StyleguideSectionProps = {
	title: string
	description: string
	children: React.ReactNode
}

// Navigation sections configuration
const sections: Section[] = [
	{
		id: 'colors',
		label: 'Colors',
		icon: <Palette className="h-5 w-5" />,
		component: <ColorSection />,
	},
	{
		id: 'typography',
		label: 'Typography',
		icon: <Type className="h-5 w-5" />,
		component: <TypographySection />,
	},
	{
		id: 'layout',
		label: 'Layout',
		icon: <Layout className="h-5 w-5" />,
		component: <LayoutSection />,
	},
	{
		id: 'components',
		label: 'Components',
		icon: <Component className="h-5 w-5" />,
		component: <ComponentsSection />,
	},
]

// Components
function StyleguideSection({ title, description, children }: StyleguideSectionProps) {
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

function SidebarNavigation({ activeSection, onSectionChange, isMobileNavOpen }: {
	activeSection: string
	onSectionChange: (section: string) => void
	isMobileNavOpen: boolean
}) {
	return (
		<aside
			className={cn(
				'md:w-64 md:sticky md:top-24 md:self-start md:h-[calc(100vh-6rem)] md:overflow-y-auto md:pr-4 transition-all duration-300 ease-in-out',
				'fixed inset-y-0 left-0 z-20 w-64 bg-background border-r border-button-border md:border-r-0 md:bg-transparent md:translate-x-0 md:opacity-100',
				isMobileNavOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:opacity-100'
			)}
		>
			<nav className="p-4 md:p-0">
				<Heading level="h2" className="text-xl mb-4 md:hidden">
					Navigation
				</Heading>
				<ul className="space-y-1">
					{sections.map((section) => (
						<li key={section.id}>
							<button
								onClick={() => onSectionChange(section.id)}
								className={cn(
									'w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-left',
									activeSection === section.id
										? 'bg-background-lighter text-title-light border-l-2 border-title-light pl-[10px]'
										: 'text-button hover:text-title-light hover:bg-background-lighter/50'
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
	)
}

// Main content sections
function ColorSection() {
	const [colors, setColors] = useState<any[]>([])

	useEffect(() => {
		const fetchColors = async () => {
			const colorData = await parseColorVariables()
			setColors(colorData)
		}
		fetchColors()
	}, [])

	return (
		<StyleguideSection
			title="Color System"
			description="Our color system is built around a dark theme with carefully selected accent colors that create a sleek, modern interface."
		>
			<ColorShowcase colors={colors} />
		</StyleguideSection>
	)
}

function TypographySection() {
	return (
		<StyleguideSection
			title="Typography"
			description="Our typography system provides consistent text styles for various purposes, from headings to body text."
		>
			<Flex direction="col" gap={8} className="w-full">
				<HeadingShowcase />
				<TextVariantsShowcase />
				<SpecialTypographyShowcase />
			</Flex>
		</StyleguideSection>
	)
}

function LayoutSection() {
	return (
		<StyleguideSection
			title="Layout Components"
			description="Our layout components provide flexible and powerful ways to structure your UI."
		>
			<Flex direction="col" gap={8} className="w-full">
				<FlexShowcase />
				<GridShowcase />
			</Flex>
		</StyleguideSection>
	)
}

function ComponentsSection() {
	return (
		<StyleguideSection
			title="UI Components"
			description="Our UI components are designed to be flexible, accessible, and easy to use."
		>
			<Flex direction="col" gap={8} className="w-full">
				<ButtonShowcase />
				<CardShowcase />
				<NavigationShowcase />
			</Flex>
		</StyleguideSection>
	)
}

// Main component
function StyleguideContent() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'colors')
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

	const handleSectionChange = (section: string) => {
		setActiveSection(section)
		router.push(`/styleguide?section=${section}`, { scroll: false })
		setIsMobileNavOpen(false)
	}

	return (
		<div className="relative pb-20">
			<section className="relative pt-16 pb-20 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<Heading level="h1" className="text-5xl md:text-6xl font-bold mb-4">
						Design System
					</Heading>
				</motion.div>
			</section>

			<Flex className="relative z-10 mt-8">
				<button
					className="md:hidden fixed top-24 right-4 z-30 bg-background-lighter border border-button-border rounded-full p-2"
					onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
				>
					<Menu className="h-5 w-5 text-title-light" />
				</button>

				<SidebarNavigation
					activeSection={activeSection}
					onSectionChange={handleSectionChange}
					isMobileNavOpen={isMobileNavOpen}
				/>

				<div className="flex-1 md:pl-8">
					{sections.find(section => section.id === activeSection)?.component}
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

// ... existing showcase components (HeadingShowcase, TextVariantsShowcase, etc.) ...
// ... existing code ...
