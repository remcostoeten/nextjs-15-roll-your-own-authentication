'use client'

import React, { useEffect, useState } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/shared/components/ui/select'
import { toast } from 'sonner'
import { FeatureFlag, isFeatureEnabled } from '@/core/config/feature-flags'

type FontOption = {
	name: string
	className: string
}

const fontOptions: FontOption[] = [
	{ name: 'Geist Mono', className: 'font-geist-mono' },
	{ name: 'JetBrains Mono', className: 'font-jetbrains-mono' },
	{ name: 'IBM Plex Mono', className: 'font-ibm-plex-mono' },
	{ name: 'Inter Mono', className: 'font-inter-mono' }
]

export default function FontSwitcher() {
	const [currentFont, setCurrentFont] = useState(fontOptions[0].className)

	useEffect(() => {
		document.body.className = currentFont
		toast.success('Font style updated')
	}, [currentFont])

	if (!isFeatureEnabled(FeatureFlag.FONT_SWITCHER)) {
		return null
	}

	return (
		<div className="fixed right-10 bottom-4 max-w-fit right-4 m-2 z-50">
			<div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-lg">
				<p className="text-xs text-muted-foreground mb-2">Font Style</p>
				<Select
					onValueChange={(value) => setCurrentFont(value)}
					defaultValue={currentFont}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select font" />
					</SelectTrigger>
					<SelectContent>
						{fontOptions.map((font) => (
							<SelectItem
								key={font.className}
								value={font.className}
							>
								{font.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
