import React from 'react'
import { authTheme } from './auth-theme'

type AuthCardProps = {
	children: React.ReactNode
	title: string
	subtitle?: string
	footer?: React.ReactNode
	maxWidth?: string
} & React.HTMLAttributes<HTMLDivElement>

export function AuthCard({
	children,
	title,
	subtitle,
	footer,
	maxWidth = '400px',
	...props
}: AuthCardProps) {
	return (
		<div
			className="flex min-h-[calc(100vh-120px)] w-full items-center justify-center p-4"
			style={{ background: authTheme.colors.background }}
			{...props}
		>
			<div
				className="w-full overflow-hidden rounded-md border border-gray-200 bg-white p-8 shadow-md transition-all"
				style={{
					maxWidth,
					borderColor: authTheme.colors.border,
					backgroundColor: authTheme.colors.backgroundCard,
				}}
			>
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-3xl font-semibold tracking-tight text-black">
						{title}
					</h1>
					{subtitle && (
						<p
							className="text-sm text-gray-500"
							style={{ color: authTheme.colors.textSecondary }}
						>
							{subtitle}
						</p>
					)}
				</div>

				<div>{children}</div>

				{footer && (
					<div
						className="mt-8 text-center text-sm"
						style={{ color: authTheme.colors.textSecondary }}
					>
						{footer}
					</div>
				)}
			</div>
		</div>
	)
}
