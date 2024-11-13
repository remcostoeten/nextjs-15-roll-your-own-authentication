'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { CodeBlock } from '../../components/code-block/code-block'
import FileTree from '../../components/file-tree'
import {
	PLAYGROUND_CONFIG,
	PLAYGROUND_STRUCTURE
} from '../../config/file-tree-sections.ts/playground-config'

export function Playground() {
	const [config, setConfig] = useState(() => {
		return Object.entries(PLAYGROUND_CONFIG).reduce(
			(acc, [key, value]) => {
				acc[key] = value.default
				return acc
			},
			{} as Record<string, any>
		)
	})

	const generateCode = () => {
		return `import { FileTree } from '@/components/file-tree'

export default function Example() {
  return (
    <FileTree
      structure={structure}
${Object.entries(config)
	.map(([key, value]) => `      ${key}={${JSON.stringify(value)}}`)
	.join('\n')}
    />
  )
}`
	}

	const renderControl = (key: string, control: any) => {
		switch (control.type) {
			case 'boolean':
				return (
					<div className="flex items-center justify-between">
						<Label htmlFor={key}>{control.label}</Label>
						<Switch
							id={key}
							checked={config[key]}
							onCheckedChange={(checked) =>
								setConfig((prev) => ({
									...prev,
									[key]: checked
								}))
							}
						/>
					</div>
				)

			case 'number':
				return (
					<div className="space-y-2">
						<Label>{control.label}</Label>
						<Slider
							min={control.min}
							max={control.max}
							step={control.step}
							value={[config[key]]}
							onValueChange={([value]) =>
								setConfig((prev) => ({ ...prev, [key]: value }))
							}
						/>
					</div>
				)

			case 'select':
				return (
					<div className="space-y-2">
						<Label>{control.label}</Label>
						<Select
							value={config[key]}
							onValueChange={(value) =>
								setConfig((prev) => ({ ...prev, [key]: value }))
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{control.options.map((option: string) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<div className="space-y-8">
			{/* Configuration */}
			<Card>
				<CardHeader>
					<CardTitle>Configuration</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-6">
						{Object.entries(PLAYGROUND_CONFIG).map(
							([key, control]) => (
								<div key={key}>
									{renderControl(key, control)}
								</div>
							)
						)}
					</div>
				</CardContent>
			</Card>

			{/* Preview */}
			<Card>
				<CardHeader>
					<CardTitle>Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
						<FileTree
							structure={PLAYGROUND_STRUCTURE}
							{...config}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Code */}
			<Card>
				<CardHeader>
					<CardTitle>Code</CardTitle>
				</CardHeader>
				<CardContent>
					<CodeBlock
						language="tsx"
						code={generateCode()}
						fileName="example.tsx"
					/>
				</CardContent>
			</Card>
		</div>
	)
}
