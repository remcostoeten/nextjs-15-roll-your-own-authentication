'use client'

import { motion } from 'framer-motion'
import type { ColorVariable } from '@/modules/(demos)/colors/types'
import { ColorShowcase } from '@/modules/(demos)/colors/components/color-showcase'
import { Heading, Text, Flex } from '@/shared/components/core'

type DemoSectionProps = {
	colors: ColorVariable[]
}

export function DemoSection({ colors }: DemoSectionProps) {
	return (
		<section className="py-16">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center mb-12"
			>
				<Heading
					level="h2"
					hasMargin={true}
					className="mb-4"
				>
					Color System
				</Heading>
				<Text
					variant="muted"
					className="max-w-2xl mx-auto"
				>
					Explore our application's color system. Click on any color
					to copy its hex value. The showcase demonstrates how colors
					are organized and used throughout the interface.
				</Text>
			</motion.div>

			<ColorShowcase colors={colors} />
		</section>
	)
}
