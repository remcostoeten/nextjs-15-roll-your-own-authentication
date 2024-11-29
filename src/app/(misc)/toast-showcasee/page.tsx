'use client'

import { CodeBlock } from '@/shared/primitives/code-block/code-block'
import { useToast } from '@/shared/primitives/toast/use-toast'
import {
	Button,
	Input,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/shared/ui'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'

type ToastAnimation = 'slide' | 'fade' | 'zoom' | 'bounce' | 'custom'
type ToastPosition =
	| 'top-right'
	| 'top-left'
	| 'bottom-right'
	| 'bottom-left'
	| 'top-center'
	| 'bottom-center'
type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

type ToastConfig = {
	animation?: ToastAnimation
	style?: {
		borderRadius?: string
		backgroundColor?: string
		color?: string
		borderColor?: string
		height?: string
		border?: string
	}
	message?: string
	variant?: ToastVariant
	position?: ToastPosition
	duration?: number
	showProgress?: boolean
	showSpinner?: boolean
	isPending?: boolean
	promise?: Promise<any> | null
	title?: string
	description?: string
}

interface CustomStyles {
	borderRadius: string
	backgroundColor: string
	color: string
	borderColor: string
	height: string
}

type ToastProps = {
	message: string
	variant?: ToastVariant | undefined
	duration?: number
	style?: React.CSSProperties
	id?: string
}

export default function AdvancedToastPlayground() {
	const { toast } = useToast()
	const [toastConfig, setToastConfig] = useState<ToastConfig>({
		message: 'This is a toast message',
		variant: 'default',
		position: 'bottom-right',
		promise: null,
		duration: 5000,
		animation: 'slide',
		showProgress: true,
		showSpinner: false,
		isPending: false
	})

	const [customStyles, setCustomStyles] = useState<CustomStyles>({
		borderRadius: '0.5rem',
		backgroundColor: '#18181B',
		color: '#FFFFFF',
		borderColor: '#27272A',
		height: '4rem'
	})

	const [showColorPicker, setShowColorPicker] = useState<string | null>(null)

	const showToast = () => {
		if (!toastConfig.variant || !toastConfig.message) return

		toast(toastConfig.message, {
			duration: toastConfig.duration
		})
	}

	const showPromiseToast = () => {
		const fakePromise = new Promise<string>((resolve, reject) => {
			setTimeout(() => {
				Math.random() > 0.5
					? resolve('Success!')
					: reject('Error occurred!')
			}, 2000)
		})

		const loadingToastId = toast('Loading...', {
			duration: Infinity
		})

		fakePromise
			.then((data) => {
				toast(`Success: ${data}`, {
					duration: toastConfig.duration
				})
			})
			.catch((err) => {
				toast(`Error: ${err}`, {
					duration: toastConfig.duration
				})
			})
	}

	const updateConfig = (key: keyof ToastConfig, value: any) => {
		setToastConfig((prev: ToastConfig) => ({ ...prev, [key]: value }))
	}

	const updateCustomStyle = (key: keyof CustomStyles, value: string) => {
		setCustomStyles((prev: CustomStyles) => ({ ...prev, [key]: value }))
	}

	return (
		<div className="container mx-auto p-4 space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Toast Playground</h1>
				<div className="space-x-2">
					<Button onClick={showToast}>Show Toast</Button>
					<Button variant="outline" onClick={showPromiseToast}>
						Test Promise Toast
					</Button>
				</div>
			</div>

			<Tabs defaultValue="basic">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="basic">Basic Settings</TabsTrigger>
					<TabsTrigger value="styling">Styling</TabsTrigger>
					<TabsTrigger value="preview">Preview</TabsTrigger>
				</TabsList>

				<TabsContent value="basic" className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Title</label>
							<Input
								value={toastConfig.title}
								onChange={(e) =>
									updateConfig('title', e.target.value)
								}
								placeholder="Toast title"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								Description
							</label>
							<Input
								value={toastConfig.description}
								onChange={(e) =>
									updateConfig('description', e.target.value)
								}
								placeholder="Toast description"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Variant
								</label>
								<select
									className="w-full rounded-md border border-input bg-background px-3 py-2"
									value={toastConfig.variant}
									onChange={(e) =>
										updateConfig(
											'variant',
											e.target.value as ToastVariant
										)
									}
								>
									<option value="default">Default</option>
									<option value="success">Success</option>
									<option value="error">Error</option>
									<option value="warning">Warning</option>
									<option value="info">Info</option>
								</select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Position
								</label>
								<select
									className="w-full rounded-md border border-input bg-background px-3 py-2"
									value={toastConfig.position}
									onChange={(e) =>
										updateConfig(
											'position',
											e.target.value as ToastPosition
										)
									}
								>
									<option value="top-right">Top Right</option>
									<option value="top-left">Top Left</option>
									<option value="bottom-right">
										Bottom Right
									</option>
									<option value="bottom-left">
										Bottom Left
									</option>
									<option value="top-center">
										Top Center
									</option>
									<option value="bottom-center">
										Bottom Center
									</option>
								</select>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								Duration (ms)
							</label>
							<Input
								type="number"
								value={toastConfig.duration}
								onChange={(e) =>
									updateConfig(
										'duration',
										Number(e.target.value)
									)
								}
								min={1000}
								step={500}
							/>
						</div>

						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Switch
									checked={toastConfig.showProgress}
									onCheckedChange={(checked) =>
										updateConfig('showProgress', checked)
									}
								/>
								<label className="text-sm font-medium">
									Show Progress
								</label>
							</div>

							<div className="flex items-center space-x-2">
								<Switch
									checked={toastConfig.showSpinner}
									onCheckedChange={(checked) =>
										updateConfig('showSpinner', checked)
									}
								/>
								<label className="text-sm font-medium">
									Show Spinner
								</label>
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="styling" className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						{Object.entries(customStyles).map(
							([key, value]: [string, string]) => (
								<div key={key} className="space-y-2">
									<Input
										value={value}
										onChange={(e) =>
											updateCustomStyle(
												key as keyof CustomStyles,
												e.target.value
											)
										}
									/>
									{key.includes('Color') && (
										<Button
											variant="outline"
											size="icon"
											onClick={() =>
												setShowColorPicker(
													showColorPicker === key
														? null
														: key
												)
											}
											className="relative"
										>
											<div
												className="w-4 h-4 rounded-full"
												style={{
													backgroundColor:
														value as string
												}}
											/>
											{showColorPicker === key && (
												<div className="absolute mt-2 top-full right-0 z-50">
													<HexColorPicker
														color={value}
														onChange={(color) =>
															updateCustomStyle(
																key as keyof CustomStyles,
																color
															)
														}
													/>
												</div>
											)}
										</Button>
									)}
								</div>
							)
						)}
					</div>
				</TabsContent>

				<TabsContent value="preview" className="space-y-4">
					<div className="p-4 border rounded-lg">
						<div className="space-y-2">
							<h3 className="font-semibold">
								Current Configuration
							</h3>
							<CodeBlock
								code={JSON.stringify(
									{ ...toastConfig, style: customStyles },
									null,
									2
								)}
								language="json"
								showLineNumbers={false}
							/>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
