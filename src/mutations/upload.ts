'use server'

import { headers } from 'next/headers'
import { getUser } from '../services/auth/get-user'
import { updateUserAvatar } from '../services/upload-service'

export async function uploadAvatarMutation(formData: FormData) {
	try {
		const user = await getUser()
		if (!user) {
			return { error: 'Unauthorized' }
		}

		const file = formData.get('file') as File
		if (!file) {
			return { error: 'No file provided' }
		}

		// Get the host from headers
		const headersList = await headers()
		const host = headersList.get('host')
		const protocol =
			process.env.NODE_ENV === 'development' ? 'http' : 'https'

		// Construct full URL
		const uploadUrl = `${protocol}://${host}/api/uploadthing`

		const response = await fetch(uploadUrl, {
			method: 'POST',
			body: formData
		})

		if (!response.ok) {
			throw new Error('Upload failed')
		}

		const { url } = await response.json()
		await updateUserAvatar(user.id, url)

		return { success: true, url }
	} catch (error) {
		console.error('Upload error:', error)
		return { error: 'Failed to upload file' }
	}
}
