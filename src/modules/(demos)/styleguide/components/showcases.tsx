import { Heading, Text, Flex } from '@/shared/components/core'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import Link from 'next/link'
import { Palette, ChevronRight } from 'lucide-react'

export function HeadingShowcase() {
	return (
		<div className="border border-button-border rounded-lg p-6 bg-background-lighter">
			<Heading
				level="h3"
				hasMargin={true}
			>
				Heading Components
			</Heading>
			<Flex
				direction="col"
				gap={4}
			>
				{[1, 2, 3, 4, 5, 6].map((level) => (
					<Flex
						key={level}
						direction="col"
						gap={1}
						className="pb-4 border-b border-button-border last:border-b-0"
					>
						<Heading
							level={`h${level}` as any}
							hasMargin={false}
						>
							Heading {level}
						</Heading>
						<Text variant="muted">
							{level === 1 && 'Used for main page titles'}
							{level === 2 && 'Used for section titles'}
							{level === 3 && 'Used for subsection titles'}
							{level === 4 && 'Used for card titles and smaller sections'}
							{level === 5 && 'Used for smaller titles'}
							{level === 6 && 'Used for the smallest titles'}
						</Text>
						<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
							{`<Heading level="h${level}">Heading ${level}</Heading>`}
						</code>
					</Flex>
				))}
			</Flex>
		</div>
	)
}

export function TextVariantsShowcase() {
	const variants = [
		{ name: 'default', description: 'Standard paragraph text' },
		{ name: 'lead', description: 'Used for introductory paragraphs' },
		{
			name: 'large',
			description: 'Used for highlighting important information',
		},
		{ name: 'muted', description: 'Used for secondary information' },
		{ name: 'small', description: 'Used for labels and small text' },
		{ name: 'subtle', description: 'Used for less important information' },
	]

	return (
		<div className="border border-button-border rounded-lg p-6 bg-background-lighter">
			<Heading
				level="h3"
				hasMargin={true}
			>
				Text Components
			</Heading>
			<Flex
				direction="col"
				gap={4}
			>
				{variants.map((variant, index) => (
					<Flex
						key={variant.name}
						direction="col"
						gap={1}
						className={`pb-4 ${index !== variants.length - 1 ? 'border-b border-button-border' : ''}`}
					>
						<Text variant={variant.name as any}>{variant.name} Text</Text>
						<Text variant="muted">{variant.description}</Text>
						<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
							{`<Text variant="${variant.name}">${variant.name} Text</Text>`}
						</code>
					</Flex>
				))}
			</Flex>
		</div>
	)
}

export function SpecialTypographyShowcase() {
	return (
		<div className="border border-button-border rounded-lg p-6 bg-background-lighter">
			<Heading
				level="h3"
				hasMargin={true}
			>
				Special Typography
			</Heading>
			<Flex
				direction="col"
				gap={4}
			>
				<Flex
					direction="col"
					gap={1}
					className="pb-4 border-b border-button-border"
				>
					<Heading
						level="h4"
						hasLink
						linkHref="#"
						hasMargin={false}
					>
						Linked Heading
					</Heading>
					<Text variant="muted">Headings with links</Text>
					<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
						{'<Heading level="h4" hasLink linkHref="#">Linked Heading</Heading>'}
					</code>
				</Flex>

				<Flex
					direction="col"
					gap={1}
					className="pb-4 border-b border-button-border"
				>
					<Text
						hasLink
						linkHref="#"
					>
						Linked Text
					</Text>
					<Text variant="muted">Text with links</Text>
					<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
						{'<Text hasLink linkHref="#">Linked Text</Text>'}
					</code>
				</Flex>

				<Flex
					direction="col"
					gap={1}
					className="pb-4 border-b border-button-border"
				>
					<Heading
						level="h4"
						iconBefore={<Palette className="h-4 w-4" />}
						hasMargin={false}
					>
						Icon Before Text
					</Heading>
					<Text variant="muted">Headings with icons before the text</Text>
					<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
						{'<Heading level="h4" iconBefore={<Palette />}>Icon Before Text</Heading>'}
					</code>
				</Flex>

				<Flex
					direction="col"
					gap={1}
				>
					<Heading
						level="h4"
						iconAfter={<ChevronRight className="h-4 w-4" />}
						hasMargin={false}
					>
						Icon After Text
					</Heading>
					<Text variant="muted">Headings with icons after the text</Text>
					<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
						{'<Heading level="h4" iconAfter={<ChevronRight />}>Icon After Text</Heading>'}
					</code>
				</Flex>
			</Flex>
		</div>
	)
}

export function FlexShowcase() {
	return (
		<div className="border border-button-border rounded-lg p-6 bg-background-lighter">
			<Heading
				level="h3"
				hasMargin={true}
			>
				Flex Component
			</Heading>
			<Flex
				direction="col"
				gap={6}
			>
				<Flex
					direction="col"
					gap={2}
				>
					<Heading
						level="h4"
						hasMargin={false}
					>
						Row Layout (Default)
					</Heading>
					<Flex
						items="center"
						justify="between"
						className="bg-background p-4 rounded border border-button-border"
					>
						{[1, 2, 3].map((num) => (
							<div
								key={num}
								className="h-16 w-16 bg-button flex items-center justify-center border border-button-border rounded"
							>
								Item {num}
							</div>
						))}
					</Flex>
					<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
						{'<Flex items="center" justify="between">...</Flex>'}
					</code>
				</Flex>

				<Flex
					direction="col"
					gap={2}
				>
					<Heading
						level="h4"
						hasMargin={false}
					>
						Column Layout
					</Heading>
					<Flex
						direction="col"
						gap={2}
						className="bg-background p-4 rounded border border-button-border"
					>
						{[1, 2, 3].map((num) => (
							<div
								key={num}
								className="h-12 bg-button flex items-center justify-center border border-button-border rounded"
							>
								Item {num}
							</div>
						))}
					</Flex>
					<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
						{'<Flex direction="col" gap={2}>...</Flex>'}
					</code>
				</Flex>

				<Flex
					direction="col"
					gap={2}
				>
					<Heading
						level="h4"
						hasMargin={false}
					>
						Wrapped Items
					</Heading>
					<Flex
						wrap="wrap"
						gap={2}
						className="bg-background p-4 rounded border border-button-border"
					>
						{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
							<div
								key={num}
								className="h-12 w-20 bg-button flex items-center justify-center border border-button-border rounded"
							>
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
	)
}

export function GridShowcase() {
	return (
		<div className="border border-button-border rounded-lg p-6 bg-background-lighter">
			<Heading
				level="h3"
				hasMargin={true}
			>
				Grid Layout
			</Heading>
			<Flex
				direction="col"
				gap={6}
			>
				<Flex
					direction="col"
					gap={2}
				>
					<Heading
						level="h4"
						hasMargin={false}
					>
						Basic Grid
					</Heading>
					<div className="grid grid-cols-3 gap-4 bg-background p-4 rounded border border-button-border">
						{[1, 2, 3, 4, 5, 6].map((num) => (
							<div
								key={num}
								className="h-16 bg-button flex items-center justify-center border border-button-border rounded"
							>
								Item {num}
							</div>
						))}
					</div>
					<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
						{'<div className="grid grid-cols-3 gap-4">...</div>'}
					</code>
				</Flex>

				<Flex
					direction="col"
					gap={2}
				>
					<Heading
						level="h4"
						hasMargin={false}
					>
						Responsive Grid
					</Heading>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-background p-4 rounded border border-button-border">
						{[1, 2, 3, 4].map((num) => (
							<div
								key={num}
								className="h-16 bg-button flex items-center justify-center border border-button-border rounded"
							>
								Item {num}
							</div>
						))}
					</div>
					<code className="mt-2 text-xs bg-background px-2 py-1 rounded text-button">
						{'<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">...</div>'}
					</code>
				</Flex>

				<Flex
					direction="col"
					gap={2}
				>
					<Heading
						level="h4"
						hasMargin={false}
					>
						Grid with Spanning Items
					</Heading>
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
	)
}

export function ButtonShowcase() {
	return (
		<div className="border border-button-border rounded-lg p-6 bg-background-lighter">
			<Heading
				level="h3"
				hasMargin={true}
			>
				Buttons
			</Heading>
			<Flex
				direction="col"
				gap={6}
			>
				<Flex
					wrap="wrap"
					gap={3}
					className="pb-4 border-b border-button-border"
				>
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
	)
}

export function CardShowcase() {
	return (
		<div className="border border-button-border rounded-lg p-6 bg-background-lighter">
			<Heading
				level="h3"
				hasMargin={true}
			>
				Cards
			</Heading>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="bg-background-lighter border border-button-border rounded-lg overflow-hidden">
					<div className="h-32 bg-background flex items-center justify-center">Image Placeholder</div>
					<div className="p-4">
						<Heading
							level="h4"
							hasMargin={true}
						>
							Card Title
						</Heading>
						<Text variant="muted">Card description text that explains the content of the card.</Text>
						<Flex
							items="center"
							justify="end"
							className="mt-4"
						>
							<button className="text-button hover:text-title-light text-sm">View More</button>
						</Flex>
					</div>
				</div>

				<div className="bg-background-lighter border border-button-border rounded-lg p-4">
					<Heading
						level="h4"
						hasMargin={true}
					>
						Simple Card
					</Heading>
					<Text variant="muted">A simple card without an image for displaying content.</Text>
					<div className="mt-4 pt-4 border-t border-button-border">
						<Flex
							items="center"
							justify="between"
						>
							<Text variant="small">Footer Info</Text>
							<button className="text-button hover:text-title-light text-sm">Action</button>
						</Flex>
					</div>
				</div>

				<div className="bg-background-lighter border border-button-border rounded-lg overflow-hidden">
					<div className="p-4">
						<Flex
							items="center"
							gap={3}
							className="mb-3"
						>
							<div className="h-10 w-10 rounded-full bg-button flex items-center justify-center">UA</div>
							<div>
								<Text
									size="sm"
									weight="medium"
								>
									User Name
								</Text>
								<Text variant="subtle">Position</Text>
							</div>
						</Flex>
						<Text variant="muted">A user card showing profile information and actions.</Text>
					</div>
					<div className="px-4 py-2 bg-background border-t border-button-border">
						<Flex
							items="center"
							justify="end"
							gap={2}
						>
							<button className="text-button hover:text-title-light text-sm">Message</button>
							<button className="text-button hover:text-title-light text-sm">Profile</button>
						</Flex>
					</div>
				</div>
			</div>
		</div>
	)
}

export function NavigationShowcase() {
	return (
		<div className="border border-button-border rounded-lg p-6 bg-background-lighter">
			<Heading
				level="h3"
				hasMargin={true}
			>
				Navigation
			</Heading>
			<Flex
				direction="col"
				gap={4}
			>
				<div className="border border-button-border rounded-lg overflow-hidden">
					<Flex
						items="center"
						justify="between"
						className="p-4 bg-background-lighter"
					>
						<Heading
							level="h4"
							hasMargin={false}
						>
							Navbar Example
						</Heading>
						<Flex
							items="center"
							gap={4}
						>
							<Link
								href="#"
								className="text-button hover:text-title-light"
							>
								Home
							</Link>
							<Link
								href="#"
								className="text-button hover:text-title-light"
							>
								About
							</Link>
							<Link
								href="#"
								className="text-button hover:text-title-light"
							>
								Contact
							</Link>
						</Flex>
					</Flex>
				</div>

				<div className="border border-button-border rounded-lg overflow-hidden">
					<Tabs
						defaultValue="tab1"
						className="w-full"
					>
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
	)
}
