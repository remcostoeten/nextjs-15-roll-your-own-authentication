import { cn } from '@/shared/helpers'
import React from 'react'

interface PlaygroundSectionProps {
	title: string
	description?: string
	children: React.ReactNode
	className?: string
}

export function PlaygroundSection({
	title,
	description,
	children,
	className,
}: PlaygroundSectionProps) {
	return (
		<section className={cn('mb-12', className)}>
			<h2 className="text-2xl font-semibold mb-3 text-neutral-200">
				{title}
			</h2>
			{description && (
				<p className="text-neutral-400 mb-6">{description}</p>
			)}
			<div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
				{children}
			</div>
		</section>
	)
}

interface PlaygroundLayoutProps {
	title: string
	description?: string
	children: React.ReactNode
	className?: string
}

export function PlaygroundLayout({
	title,
	description,
	children,
	className,
}: PlaygroundLayoutProps) {
	return (
		<div className={cn('max-w-4xl mx-auto py-8 px-6', className)}>
			<header className="mb-12">
				<h1 className="text-3xl font-bold mb-4 text-neutral-100">
					{title}
				</h1>
				{description && (
					<p className="text-lg text-neutral-400">{description}</p>
				)}
			</header>
			<div className="space-y-12">{children}</div>
		</div>
	)
}

interface PlaygroundDemoProps {
	children: React.ReactNode
	className?: string
	centered?: boolean
}

export function PlaygroundDemo({
	children,
	className,
	centered = false,
}: PlaygroundDemoProps) {
	return (
		<div
			className={cn(
				'min-h-[100px] w-full',
				centered && 'flex items-center justify-center',
				className
			)}
		>
			{children}
		</div>
	)
}

interface PlaygroundControlsProps {
	children: React.ReactNode
	className?: string
}

export function PlaygroundControls({
	children,
	className,
}: PlaygroundControlsProps) {
	return (
		<div className={cn('mt-6 flex flex-wrap gap-4', className)}>
			{children}
		</div>
	)
}
