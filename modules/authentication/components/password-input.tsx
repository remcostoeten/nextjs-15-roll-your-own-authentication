'use client'

import { useState, useRef } from 'react'
import { AnimatedEyeIcon } from './animated-eye-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type TProps = {
	id: string
	name: string
	autoComplete: string
	required?: boolean
	placeholder?: string
	className?: string
}

export function PasswordInput({
	id,
	name,
	autoComplete,
	required = false,
	placeholder = '••••••••',
	className,
}: TProps) {
	const [showPassword, setShowPassword] = useState(false)
	const [value, setValue] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const togglePassword = () => {
		setShowPassword(!showPassword)
		// Maintain focus on input after toggle
		setTimeout(() => {
			inputRef.current?.focus()
		}, 0)
	}

	return (
		<div className="relative">
			<Input
				ref={inputRef}
				id={id}
				name={name}
				type={showPassword ? 'text' : 'password'}
				autoComplete={autoComplete}
				required={required}
				placeholder={placeholder}
				className={`bg-[#0d0d0d] border-[#1a1d23] focus-visible:ring-0 focus-visible:border-[#252a33] transition-colors duration-300 rounded-sm pr-10 ${className}`}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>

			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
				onClick={togglePassword}
			>
				<AnimatedEyeIcon
					isOpen={showPassword}
					className="h-5 w-5 flex items-center justify-center"
				/>
				<span className="sr-only">
					{showPassword ? 'Hide password' : 'Show password'}
				</span>
			</Button>
		</div>
	)
}
