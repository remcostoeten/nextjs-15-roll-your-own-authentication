import React from 'react'
import { authTheme } from './auth-theme'

type AuthDividerProps = {
	text?: string
} & React.HTMLAttributes<HTMLDivElement>

export function AuthDivider({ text = 'or', ...props }: AuthDividerProps) {
	return (
		<div
			className="relative my-8 flex items-center"
			{...props}
		>
			<div
				className="flex-grow border-t"
				style={{ borderColor: authTheme.colors.border }}
			/>
			{text && (
				<span
					className="mx-4 flex-shrink text-xs font-medium uppercase"
					style={{ color: authTheme.colors.textSecondary }}
				>
					{text}
				</span>
			)}
			<div
				className="flex-grow border-t"
				style={{ borderColor: authTheme.colors.border }}
			/>
		</div>
	)
}
