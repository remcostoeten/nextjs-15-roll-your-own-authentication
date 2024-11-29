'use client'

import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { cn } from 'helpers'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { CodeBlock } from './code-block'
import { ShieldLogo } from './shield-logo'
import { AnimationVariant } from './types'

type VariantCardProps = {
	variant: string
	customColors: Record<string, string>
	variantCode: string
	description: string
	className?: string
	animationMode?: string
}

export function VariantCard({
	variant,
	customColors,
	variantCode,
	description,
	className,
	animationMode = 'default'
}: VariantCardProps) {
	const [key, setKey] = useState(0)

	const handleReplay = () => {
		setKey((k) => k + 1)
	}

	const getAnimationVariants = () => {
		switch (animationMode) {
			case 'stagger':
				return {
					hidden: { y: 20, opacity: 0 },
					visible: {
						y: 0,
						opacity: 1,
						transition: {
							duration: 0.5,
							ease: 'backOut',
							staggerChildren: 0.2
						}
					}
				}
			case 'rotate':
				return {
					hidden: { rotate: -180, opacity: 0 },
					visible: {
						rotate: 0,
						opacity: 1,
						transition: { type: 'spring', damping: 10 }
					}
				}
			case 'wave':
				return {
					hidden: { y: 50, opacity: 0 },
					visible: {
						y: [0, -20, 0],
						opacity: 1,
						transition: {
							y: {
								repeat: Infinity,
								repeatType: 'reverse',
								duration: 2,
								ease: 'easeInOut'
							}
						}
					}
				}
			case 'glassmorphic':
				return {
					hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
					visible: {
						opacity: 1,
						backdropFilter: 'blur(10px)',
						transition: {
							duration: 1,
							ease: 'easeInOut',
							repeat: Infinity,
							repeatType: 'reverse'
						}
					}
				}
			default:
				return {
					hidden: { opacity: 0 },
					visible: { opacity: 1, transition: { duration: 0.5 } }
				}
		}
	}

	return (
		<Card
			className={cn(
				'flex flex-col gap-4 p-6 transition-colors duration-300',
				className
			)}
		>
			<div className="flex flex-col items-center gap-4">
				<div className="relative">
					<ShieldLogo
						key={key}
						size="lg"
						animated
						animationVariant={variant as AnimationVariant}
						hasTooltip
						tooltipContent={description || `${variant} animation`}
						{...customColors}
					/>
					<Button
						size="icon"
						variant="ghost"
						className="absolute -top-2 -right-2 h-8 w-8"
						onClick={handleReplay}
					>
						<RefreshCw className="h-4 w-4" />
						<span className="sr-only">Replay animation</span>
					</Button>
				</div>
				<div className="text-center">
					<span className="text-sm font-medium capitalize">
						{variant}
					</span>
					{description && (
						<p className="mt-1 text-xs text-muted-foreground">
							{description}
						</p>
					)}
				</div>
			</div>
			<CodeBlock
				title={variant}
				code={variantCode}
				className="border-t pt-4"
				onReplay={handleReplay}
			/>
		</Card>
	)
}
