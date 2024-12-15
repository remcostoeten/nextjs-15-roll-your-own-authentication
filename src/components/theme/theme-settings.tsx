'use client'

import * as React from 'react'
import { Paintbrush, Check } from 'lucide-react'
import { useThemeAccent } from '@/hooks/use-theme-accent'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogDescription
} from '@/shared/components/ui/dialog'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { SUPABASE_GREEN } from '@/lib/themes'

const presetColors = [
	{ name: 'Supabase', value: SUPABASE_GREEN },
	{ name: 'Violet', value: '#8B5CF6' },
	{ name: 'Blue', value: '#3B82F6' },
	{ name: 'Emerald', value: '#10B981' },
	{ name: 'Rose', value: '#F43F5E' },
	{ name: 'Orange', value: '#F97316' }
]

export default function ThemeSettings() {
	const { accentColor, setAccentColor, resetToDefault } = useThemeAccent()
	const [mounted, setMounted] = React.useState(false)
	const [isOpen, setIsOpen] = React.useState(false)

	React.useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="flex items-center gap-2 px-2 py-1.5 w-full"
					onClick={() => setIsOpen(true)}
				>
					<Paintbrush className="h-4 w-4 text-violet-500" />
					<span>Customize Theme</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
				<DialogHeader>
					<DialogTitle>Theme Settings</DialogTitle>
					<DialogDescription>
						Customize the appearance of your application
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-6 py-4">
					<div className="space-y-4">
						<div>
							<Label
								htmlFor="accentColor"
								className="text-sm font-medium"
							>
								Accent Color
							</Label>
							<div className="mt-4">
								<div className="grid grid-cols-3 gap-2">
									{presetColors.map((color) => (
										<Button
											key={color.value}
											variant="outline"
											className="relative h-12 w-full rounded-md border-2 p-1 hover:border-ring"
											style={{
												borderColor:
													accentColor === color.value
														? color.value
														: undefined
											}}
											onClick={() =>
												setAccentColor(color.value)
											}
										>
											<div className="flex items-center gap-2">
												<div
													className="h-6 w-6 rounded-full"
													style={{
														backgroundColor:
															color.value
													}}
												/>
												<span className="text-xs">
													{color.name}
												</span>
											</div>
											{accentColor === color.value && (
												<Check className="absolute right-1 top-1 h-4 w-4 text-foreground" />
											)}
										</Button>
									))}
								</div>
							</div>
							<div className="mt-4 flex items-center gap-4">
								<div className="flex items-center gap-2">
									<div
										className="h-10 w-10 rounded-md border border-input"
										style={{ backgroundColor: accentColor }}
									/>
									<input
										type="color"
										id="accentColor"
										value={accentColor}
										onChange={(e) =>
											setAccentColor(e.target.value)
										}
										className="h-10 w-20 cursor-pointer rounded border border-input bg-background p-1"
									/>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={resetToDefault}
									className="ml-auto"
								>
									Reset
								</Button>
							</div>
						</div>
						<div className="space-y-3">
							<p className="text-sm font-medium">Preview</p>
							<div className="rounded-lg border border-border bg-card p-4 space-y-3">
								<Button
									variant="default"
									className="w-full"
									style={{ backgroundColor: accentColor }}
								>
									Primary Button
								</Button>
								<Button
									variant="outline"
									className="w-full border-2"
									style={{ borderColor: accentColor }}
								>
									Outline Button
								</Button>
								<div className="flex items-center gap-2 text-sm">
									Text with{' '}
									<span
										style={{ color: accentColor }}
										className="font-medium"
									>
										accent color
									</span>{' '}
									applied
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
