import type { HTMLAttributes, ButtonHTMLAttributes } from 'react'

declare global {
	// Base component props with HTML attributes
	type BaseProps<T = HTMLElement> = ComponentProps & HTMLAttributes<T>

	// Button component props
	type ButtonProps = ComponentProps & ButtonHTMLAttributes<HTMLButtonElement>

	// Form field props
	type FieldProps = ComponentProps & {
		label?: string
		error?: string
		required?: boolean
	}

	// Select field props
	type SelectProps<T = string> = FieldProps & {
		options: Array<{
			label: string
			value: T
		}>
		value?: T
		onChange?: (value: T) => void
	}
}

export {}
