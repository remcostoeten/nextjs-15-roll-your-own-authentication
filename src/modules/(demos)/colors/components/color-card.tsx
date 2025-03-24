'use client'

import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

type ColorCardProps = {
	name: string
	value: string
	classes: string[]
}

export function ColorCard({ name, value, classes }: ColorCardProps) {
	const [copied, setCopied] = useState(false)

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		toast.success('Copied to clipboard', {
			description: text,
			duration: 2000,
		})
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="w-full"
		>
			<Card className="bg-panel border border-button-border overflow-hidden">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-title-light text-lg font-medium">{name}</CardTitle>
						<Button
							variant="outline"
							size="sm"
							className="bg-button border-button-border text-button hover:bg-button hover:text-title-light"
							onClick={() => copyToClipboard(value)}
						>
							<Copy className="h-3.5 w-3.5 mr-1" />
							{copied ? 'Copied' : 'Copy'}
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div
						className="w-full h-24 rounded-md border border-button-border"
						style={{ backgroundColor: value }}
					/>
					<div>
						<p className="text-sm text-title-light mb-2">
							Value: <code className="bg-button px-1.5 py-0.5 rounded text-xs">{value}</code>
						</p>
						<div className="space-y-1.5">
							<p className="text-sm text-title-light">Utility Classes:</p>
							<div className="flex flex-wrap gap-2">
								{classes.map((cls) => (
									<div
										key={cls}
										className="bg-button px-2 py-1 rounded text-xs text-button cursor-pointer hover:bg-opacity-80 transition-colors border border-button-border"
										onClick={() => copyToClipboard(cls)}
									>
										{cls}
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}
