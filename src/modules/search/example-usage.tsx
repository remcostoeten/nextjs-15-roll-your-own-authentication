'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CommandPalette } from './components/command-palette'
import { CommandPaletteTrigger } from './components/command-palette-trigger'
import { AnimationsProvider } from './components/animations-provider'
import { useAnimations } from './hooks/use-animations'

export default function SearchExample() {
	const [open, setOpen] = useState(false)

	return (
		<AnimationsProvider>
			<AnimatedContent
				open={open}
				setOpen={setOpen}
			/>
		</AnimationsProvider>
	)
}

function AnimatedContent({
	open,
	setOpen,
}: {
	open: boolean
	setOpen: (open: boolean) => void
}) {
	const { animationsEnabled } = useAnimations()

	return (
		<>
			<motion.div
				className="text-center"
				initial={
					animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }
				}
				animate={{ opacity: 1, y: 0 }}
				transition={
					animationsEnabled ? { duration: 0.5 } : { duration: 0 }
				}
			>
				<CommandPaletteTrigger setOpen={setOpen} />
				<motion.div
					className="mt-8 text-gray-400 text-sm"
					initial={
						animationsEnabled
							? { opacity: 0, y: 10 }
							: { opacity: 1 }
					}
					animate={{ opacity: 1, y: 0 }}
					transition={
						animationsEnabled
							? { duration: 0.5, delay: 0.3 }
							: { duration: 0 }
					}
				></motion.div>
			</motion.div>
			<CommandPalette
				open={open}
				setOpen={setOpen}
			/>
		</>
	)
}
