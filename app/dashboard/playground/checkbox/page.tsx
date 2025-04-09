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

export default function CheckboxPlayground() {
	const [checked, setChecked] = useState(false)

	return (
		<PlaygroundLayout
			title="Checkbox Playground"
			description="Explore different variations and states of the custom checkbox component."
		>
			<PlaygroundSection
				title="Basic Usage"
				description="The default checkbox with a label."
			>
				<PlaygroundDemo centered>
					<Checkbox label="Default Checkbox" />
				</PlaygroundDemo>
			</PlaygroundSection>

			<PlaygroundSection
				title="Controlled State"
				description="A checkbox with controlled checked state and state indicator."
			>
				<PlaygroundDemo centered>
					<div className="space-y-4">
						<Checkbox
							label="Toggle me"
							checked={checked}
							onChange={(isChecked) => setChecked(isChecked)}
						/>
						<p className="text-sm text-neutral-400">
							Current state: {checked ? 'Checked' : 'Unchecked'}
						</p>
					</div>
				</PlaygroundDemo>
				<PlaygroundControls>
					<Button
						variant="outline"
						onClick={() => setChecked(!checked)}
					>
						Toggle Checkbox
					</Button>
				</PlaygroundControls>
			</PlaygroundSection>

			<PlaygroundSection
				title="States"
				description="Different states of the checkbox component."
			>
				<PlaygroundDemo>
					<div className="flex flex-col gap-4">
						<Checkbox label="Default Checkbox" />
						<Checkbox
							label="Checked by Default"
							defaultChecked
						/>
						<Checkbox
							label="Disabled Checkbox"
							disabled
						/>
						<Checkbox
							label="Disabled & Checked"
							disabled
							defaultChecked
						/>
						<Checkbox
							label="Required Field"
							required
						/>
					</div>
				</PlaygroundDemo>
			</PlaygroundSection>

			<PlaygroundSection
				title="Variants"
				description="Different styles and sizes of checkboxes."
			>
				<PlaygroundDemo>
					<div className="flex flex-col gap-4">
						<Checkbox
							label="Custom Colors"
							color="#22c55e"
							hoverColor="#16a34a"
							activeColor="#15803d"
						/>
						<Checkbox
							label="Larger Size"
							size={24}
						/>
						<Checkbox
							label="Round Checkbox"
							round
						/>
					</div>
				</PlaygroundDemo>
			</PlaygroundSection>

			<PlaygroundSection
				title="Group Example"
				description="Multiple checkboxes working together."
			>
				<PlaygroundDemo>
					<div className="space-y-6">
						<div className="flex flex-col gap-2">
							<h3 className="text-sm font-medium text-neutral-200">
								Select your interests:
							</h3>
							<div className="space-y-2">
								<Checkbox label="Technology" />
								<Checkbox label="Design" />
								<Checkbox label="Development" />
								<Checkbox label="Business" />
							</div>
						</div>
					</div>
				</PlaygroundDemo>
			</PlaygroundSection>
		</PlaygroundLayout>
	)
}
