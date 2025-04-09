'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	PlaygroundLayout,
	PlaygroundSection,
	PlaygroundDemo,
	PlaygroundControls,
} from '@/components/playground/playground-layout'

export default function FlexerPlayground() {
	const [direction, setDirection] = useState<'row' | 'column'>('row')
	const [justify, setJustify] = useState<string>('flex-start')
	const [align, setAlign] = useState<string>('flex-start')
	const [gap, setGap] = useState<number>(4)

	const items = ['Item 1', 'Item 2', 'Item 3']

	return (
		<PlaygroundLayout
			title="Flexbox Playground"
			description="Experiment with different flexbox properties to understand how they work."
		>
			<PlaygroundSection
				title="Basic Layout"
				description="Try different flex container properties to see how they affect the layout."
			>
				<PlaygroundDemo className="min-h-[200px]">
					<div
						className="w-full h-full border border-dashed border-neutral-700 rounded-lg p-4"
						style={{
							display: 'flex',
							flexDirection: direction,
							justifyContent: justify,
							alignItems: align,
							gap: `${gap * 4}px`,
						}}
					>
						{items.map((item, index) => (
							<div
								key={index}
								className="bg-neutral-800 text-neutral-200 p-4 rounded-md"
							>
								{item}
							</div>
						))}
					</div>
				</PlaygroundDemo>
				<PlaygroundControls>
					<div className="space-y-4 w-full">
						<div className="space-x-2">
							<Button
								variant={
									direction === 'row' ? 'default' : 'outline'
								}
								onClick={() => setDirection('row')}
							>
								Row
							</Button>
							<Button
								variant={
									direction === 'column'
										? 'default'
										: 'outline'
								}
								onClick={() => setDirection('column')}
							>
								Column
							</Button>
						</div>
						<div className="space-x-2">
							{[
								'flex-start',
								'center',
								'flex-end',
								'space-between',
								'space-around',
							].map((value) => (
								<Button
									key={value}
									variant={
										justify === value
											? 'default'
											: 'outline'
									}
									onClick={() => setJustify(value)}
								>
									{value}
								</Button>
							))}
						</div>
						<div className="space-x-2">
							{[
								'flex-start',
								'center',
								'flex-end',
								'stretch',
							].map((value) => (
								<Button
									key={value}
									variant={
										align === value ? 'default' : 'outline'
									}
									onClick={() => setAlign(value)}
								>
									{value}
								</Button>
							))}
						</div>
						<div className="space-x-2">
							{[2, 4, 6, 8].map((value) => (
								<Button
									key={value}
									variant={
										gap === value ? 'default' : 'outline'
									}
									onClick={() => setGap(value)}
								>
									Gap {value}
								</Button>
							))}
						</div>
					</div>
				</PlaygroundControls>
			</PlaygroundSection>

			<PlaygroundSection
				title="Centered Content"
				description="A common use case: perfectly centered content."
			>
				<PlaygroundDemo>
					<div className="w-full h-[200px] border border-dashed border-neutral-700 rounded-lg">
						<div className="w-full h-full flex items-center justify-center">
							<div className="bg-neutral-800 text-neutral-200 p-4 rounded-md">
								Centered Content
							</div>
						</div>
					</div>
				</PlaygroundDemo>
			</PlaygroundSection>

			<PlaygroundSection
				title="Responsive Layout"
				description="This section demonstrates a responsive flex layout that adapts to different screen sizes."
			>
				<PlaygroundDemo>
					<div className="w-full border border-dashed border-neutral-700 rounded-lg p-4">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 bg-neutral-800 text-neutral-200 p-4 rounded-md">
								Column 1
							</div>
							<div className="flex-1 bg-neutral-800 text-neutral-200 p-4 rounded-md">
								Column 2
							</div>
							<div className="flex-1 bg-neutral-800 text-neutral-200 p-4 rounded-md">
								Column 3
							</div>
						</div>
					</div>
				</PlaygroundDemo>
			</PlaygroundSection>
		</PlaygroundLayout>
	)
}
