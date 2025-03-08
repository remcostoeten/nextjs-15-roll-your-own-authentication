import React from 'react'
import { authTheme } from './auth-theme'

type Provider = 'github' | 'google' | 'twitter'

type AuthSocialButtonProps = {
	provider: Provider
	onClick?: () => void
	isLoading?: boolean
	fullWidth?: boolean
	text?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

// Provider icons
const icons: Record<Provider, React.ReactNode> = {
	github: (
		<svg
			width="18"
			height="18"
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
			/>
		</svg>
	),
	google: (
		<svg
			width="18"
			height="18"
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
				fill="#4285F4"
			/>
			<path
				d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
				fill="#34A853"
			/>
			<path
				d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
				fill="#FBBC05"
			/>
			<path
				d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
				fill="#EA4335"
			/>
		</svg>
	),
	twitter: (
		<svg
			width="18"
			height="18"
			fill="#1DA1F2"
			viewBox="0 0 24 24"
		>
			<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
		</svg>
	),
}

// Provider colors and hover colors
const providerStyles: Record<
	Provider,
	{ bg: string; hover: string; text: string }
> = {
	github: {
		bg: 'bg-gray-900',
		hover: 'hover:bg-gray-800',
		text: 'text-white',
	},
	google: {
		bg: 'bg-white',
		hover: 'hover:bg-gray-50',
		text: 'text-gray-800',
	},
	twitter: {
		bg: 'bg-[#1DA1F2]',
		hover: 'hover:bg-[#0c8ed9]',
		text: 'text-white',
	},
}

export function AuthSocialButton({
	provider,
	onClick,
	isLoading = false,
	fullWidth = false,
	text,
	className,
	...props
}: AuthSocialButtonProps) {
	const style = providerStyles[provider]
	const defaultText = {
		github: 'Continue with GitHub',
		google: 'Continue with Google',
		twitter: 'Continue with Twitter',
	}[provider]

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isLoading}
			className={`flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 ${
				fullWidth ? 'w-full' : ''
			} ${className || ''}`}
			style={{ borderColor: authTheme.colors.border }}
			{...props}
		>
			{isLoading ? (
				<svg
					className="mr-2 h-4 w-4 animate-spin"
					fill="none"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						fill="currentColor"
					/>
				</svg>
			) : (
				<span className="mr-3">{icons[provider]}</span>
			)}
			<span>{text || defaultText}</span>
		</button>
	)
}
