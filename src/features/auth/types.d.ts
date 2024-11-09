'use client'

export type User = {
	id: string
	email: string
	password: string
	createdAt: string
	updatedAt: string
}

export type SessionUser = {
	userId: string
	email: string
}

export type AuthState = {
	isAuthenticated: boolean
	isLoading: boolean
	error?: {
		_form?: string[]
		email?: string[]
		password?: string[]
		confirmPassword?: string[]
	}
	user?: SessionUser
	redirect?: string
}

export type FieldErrors = {
	[key: string]: string | undefined
}

export type FormError = {
	_form?: string[]
}
