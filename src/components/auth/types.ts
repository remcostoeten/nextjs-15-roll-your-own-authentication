export type FormData = {
	firstName?: string
	lastName?: string
	email: string
	password: string
}

export type InputFieldProps = {
	label: string
	placeholder: string
	type?: 'text' | 'email' | 'password'
	icon?: React.ReactNode
	helperText?: string
	index: number
	value: string
	onChange: (value: string) => void
	required?: boolean
}

export type SocialButtonProps = {
	icon: string
	label: string
	onClick?: () => void
	index: number
}

export type AuthResult = {
	success: boolean
	error?: string
	message?: string
}
