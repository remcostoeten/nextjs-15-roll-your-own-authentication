export type FormActionSuccess = {
	success: true
	redirect: string
}

export type FormActionError = {
	success: false
	error: {
		_form?: string[]
		email?: string[]
		password?: string[]
		confirmPassword?: string[]
	}
}

export type FormActionResult = FormActionSuccess | FormActionError
