// app/dashboard/playground/ui/flexer/page.tsx

import React from 'react'
import { Flex } from '@/shared/components/flexer'
import Checkbox from '@/shared/components/core/checkbox/Checkbox'

const FlexerPlayground = () => {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Flexer Playground</h1>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Basic Usage</h2>
				<Flex>
					<div>Item 1</div>
					<div>Item 2</div>
					<div>Item 3</div>
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Column Layout</h2>
				<Flex
					column
					gap="md"
				>
					<div>Top</div>
					<div>Middle</div>
					<div>Bottom</div>
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Centered Content</h2>
				<Flex
					center
					className="h-32 bg-gray-100"
				>
					<div>Perfectly centered</div>
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Space Between</h2>
				<Flex
					between
					className="w-full bg-gray-100 p-2"
				>
					<button className="px-4 py-2 bg-blue-500 text-white rounded">
						Cancel
					</button>
					<button className="px-4 py-2 bg-green-500 text-white rounded">
						Save
					</button>
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Navigation Bar</h2>
				<Flex
					between
					middle
					className="bg-gray-100 p-4"
				>
					<div>Logo</div>
					<Flex gap="lg">
						<a href="/">Home</a>
						<a href="/about">About</a>
						<a href="/contact">Contact</a>
					</Flex>
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					Card Layout (Reverse Column)
				</h2>
				<Flex
					column
					reverse
					gap="sm"
					className="border p-4 rounded"
				>
					<button className="px-4 py-2 bg-blue-500 text-white rounded">
						Read More
					</button>
					<p>Card description text here...</p>
					<h3>Card Title</h3>
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Wrapping Items</h2>
				<Flex
					wrap
					gap="md"
					className="w-full"
				>
					{Array.from({ length: 10 }).map((_, index) => (
						<div
							key={index}
							className="w-1/4 bg-gray-100 p-4 rounded"
						>
							Item {index + 1}
						</div>
					))}
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					As Different Element
				</h2>
				<Flex
					as="section"
					column
					gap="lg"
					className="py-8 bg-gray-100 p-4"
				>
					<h2>Section Title</h2>
					<p>Section content...</p>
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">With onClick</h2>
				<Flex
					center
					className="bg-blue-100 p-4 rounded cursor-pointer hover:bg-blue-200"
					onClick={() => alert('Clicked!')}
				>
					<span>Click me!</span>
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					Responsive Layout
				</h2>
				<Flex
					column
					gap="md"
					className="md:flex-row md:justify-between w-full bg-gray-100 p-4"
				>
					<div>Left on mobile, Left on desktop</div>
					<div>Middle on mobile, Middle on desktop</div>
					<div>Bottom on mobile, Right on desktop</div>
				</Flex>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					Flex with Checkbox
				</h2>
				<Flex
					center
					gap="sm"
				>
					<Checkbox label="Option 1" />
					<Checkbox
						label="Option 2"
						disabled
					/>
				</Flex>
			</section>
		</div>
	)
}

export default FlexerPlayground
