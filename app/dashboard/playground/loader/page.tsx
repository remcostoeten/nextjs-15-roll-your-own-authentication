'use client'

import { useState } from 'react'
import Checkbox from '@/shared/components/core/checkbox/Checkbox'
import {
	PlaygroundLayout,
	PlaygroundSection,
	PlaygroundDemo,
	PlaygroundControls,
} from '@/components/playground/playground-layout'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

export default function LoaderPlayground() {
	const [checked, setChecked] = useState(false)

	return (
		<PlaygroundLayout
			title="Loader Playground"
			description="Explore different variations and states of the custom loader component."
		>
			<PlaygroundSection
				title="Basic Usage"
				description="The default checkbox with a label."
			>
				<PlaygroundDemo centered>
					<Loader
						color="#ff6347"
						size={100}
						speed={1.2}
						strokeWidth={4}
					/>
				</PlaygroundDemo>
			</PlaygroundSection>

			<PlaygroundSection
				title="Controlled State"
				description="A checkbox with controlled checked state and state indicator."
			>
				<PlaygroundDemo centered>
					<Loader
						color="#32cd32"
						size={150}
						speed={2}
						strokeWidth={2}
					/>
				</PlaygroundDemo>
			</PlaygroundSection>
		</PlaygroundLayout>
	)
}
