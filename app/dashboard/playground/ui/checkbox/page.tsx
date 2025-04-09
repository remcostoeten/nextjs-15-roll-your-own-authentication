'use client'

import React, { useState } from 'react'
import Checkbox from '@/shared/components/core/checkbox/Checkbox'

const CheckboxPlayground = () => {
	const [checkedState, setCheckedState] = useState({
		default: false,
		custom: false,
	})

	const handleCheckboxChange =
		(checkboxName: string) => (checked: boolean) => {
			setCheckedState((prevState) => ({
				...prevState,
				[checkboxName]: checked,
			}))
		}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Checkbox Playground</h1>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Basic Usage</h2>
				<Checkbox label="Default Checkbox" />
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Checked State</h2>
				<Checkbox
					label="Initially Checked"
					checked={checkedState.default}
					onChange={handleCheckboxChange('default')}
				/>
				<p>
					Checkbox is{' '}
					<span className="font-bold">
						{checkedState.default ? 'checked' : 'unchecked'}
					</span>
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Disabled State</h2>
				<Checkbox
					label="Disabled Checkbox"
					disabled
				/>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Required Field</h2>
				<Checkbox
					label="Required Checkbox"
					required
				/>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Custom Styling</h2>
				<Checkbox
					label="Custom Colors & Size"
					color="#ff0000"
					hoverColor="#ff5555"
					activeColor="#cc0000"
					size={24}
					checked={checkedState.custom}
					onChange={handleCheckboxChange('custom')}
				/>
				<p>
					Custom checkbox is{' '}
					<span className="font-bold">
						{checkedState.custom ? 'checked' : 'unchecked'}
					</span>
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Round Checkbox</h2>
				<Checkbox
					label="Round Checkbox"
					round
				/>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">Custom ID</h2>
				<Checkbox
					label="Custom ID Checkbox"
					id="my-custom-id"
				/>
				<label
					htmlFor="my-custom-id"
					className="block mt-2"
				>
					This label is connected to the checkbox using the custom ID.
				</label>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">Event Handling</h2>
				<Checkbox
					label="Clickable Checkbox"
					onClick={() => alert('Checkbox Clicked!')}
				/>
			</section>
		</div>
	)
}

export default CheckboxPlayground
