'use client'

import type { ButtonHTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'

type SubmitButtonProps = {
	variant: 'signin' | 'signup'
	className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function SubmitButton({
	variant,
	className = '',
	...props
}: SubmitButtonProps) {
	const { pending } = useFormStatus()

	const buttonText = {
		signin: pending ? 'Signing in...' : 'Sign in',
		signup: pending ? 'Signing up...' : 'Sign up'
	}[variant]

	return (
		<button
			type="submit"
			disabled={pending}
			className={`
					relative w-full flex items-center justify-center gap-2 
					py-2.5 px-4 bg-white text-black rounded-md font-medium 
					hover:bg-zinc-100 transition-all duration-200
					disabled:opacity-50 disabled:cursor-not-allowed
					focus:outline-none focus:ring-2 focus:ring-offset-2 
					focus:ring-white focus:ring-offset-zinc-900
					${className}
			`}
			{...props}
		>
			{pending && (
				<svg
					className="animate-spin -ml-1 mr-2 h-5 w-5 text-black"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					aria-hidden="true"
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
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			)}
			<span className={pending ? 'opacity-75' : ''}>{buttonText}</span>
		</button>
	)
}
