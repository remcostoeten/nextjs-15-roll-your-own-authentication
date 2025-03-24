import type { User } from '../../models/z.user'

export async function getUserQuery(): Promise<User | null> {
	try {
		const response = await fetch('/api/auth/me', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			if (response.status === 401) {
				return null
			}
			throw new Error('Failed to fetch user')
		}

		const data = await response.json()
		return data.user
	} catch (error) {
		console.error('Error fetching user:', error)
		return null
	}
}
