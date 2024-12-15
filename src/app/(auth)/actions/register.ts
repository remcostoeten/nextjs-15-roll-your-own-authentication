'use server'

export async function registerAction(formData: FormData) {
	const email = formData.get('email')?.toString()
	const password = formData.get('password')?.toString()
	const name = formData.get('name')?.toString()

	if (!email || !password || !name) {
		throw new Error('Missing required fields')
	}

	return { email, password, name }
}
