import type { ReactNode } from 'react'

export type FormData = {
	email: string
	password: string
	firstName?: string
	lastName?: string
}

export type AuthShellProps = {
	title: string
	subtitle: string
	backgroundImage: string
	children: ReactNode
}

export type InputFieldProps = {
	label: string
	placeholder: string
	type?: 'text' | 'email' | 'password'
	icon?: ReactNode
	helperText?: string
	index: number
	value: string
	onChange: (value: string) => void
	required?: boolean
}

export type SocialButtonProps = {
	icon: ReactNode
	label: string
	index: number
}
