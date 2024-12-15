'use server'

export async function loginAction(formData: FormData) {
	const email = formData.get('email')?.toString()
	const password = formData.get('password')?.toString()
	const remember = formData.get('rememberMe') === 'true'

	if (!email || !password) {
		throw new Error('Missing required fields')
	}

	return { email, password, remember }
}
