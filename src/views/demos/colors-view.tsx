import { parseColorVariables } from '@/modules/(demos)/colors/helpers/color-parser'
import { Hero } from '@/modules/(demos)/colors/components/colors-hero'
import { ColorsGrid } from '@/modules/(demos)/colors/components/colors-grid'
import { DemoSection } from '@/modules/(demos)/colors/components/demo-section'
import { Heading, Flex } from '@/shared/components/core'
import { Header } from '@/components/layout/header'

export async function ColorsView() {
	const colors = await parseColorVariables()

	return (
		<div className="min-h-screen text-title-light">
			<Header />
			<main className="container mx-auto px-4 pb-20">
				<Hero />

				{/* Add the new Demo Section */}
				<div className="max-w-7xl mx-auto mb-20">
					<DemoSection colors={colors} />
				</div>

				<Flex
					direction="col"
					justify="center"
					items="center"
					className="max-w-7xl mx-auto"
				>
					<Heading
						level="h2"
						align="center"
						hasMargin={true}
						className="mb-8"
					>
						All Color Variables
					</Heading>
					<ColorsGrid colors={colors} />
				</Flex>
			</main>
		</div>
	)
}
