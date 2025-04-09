import React from 'react'
import Title from '@/shared/components/headings'

const HeadingsPlayground = () => {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Headings Playground</h1>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Basic Usage</h2>
				<Title>Default H1 Heading</Title>
				<Title level={2}>H2 Heading</Title>
				<Title level={3}>H3 Heading</Title>
				<Title level={4}>H4 Heading</Title>
				<Title level={5}>H5 Heading</Title>
				<Title level={6}>H6 Heading</Title>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Custom Styling</h2>
				<Title className="text-blue-500 font-bold">
					Styled Heading (Blue and Bold)
				</Title>
				<Title
					level={2}
					className="text-green-600 italic"
				>
					Styled H2 (Green and Italic)
				</Title>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Accessibility</h2>
				<Title id="accessible-heading">Accessible Heading</Title>
				<a href="#accessible-heading">Link to Accessible Heading</a>
				<Title aria-label="Custom Aria Label">
					Heading with Aria Label
				</Title>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">
					Passing Other Props
				</h2>
				<Title data-testid="heading-element">
					Heading with Data Attribute
				</Title>
				<Title onClick={() => alert('Heading Clicked!')}>
					Clickable Heading
				</Title>
			</section>
		</div>
	)
}

export default HeadingsPlayground
