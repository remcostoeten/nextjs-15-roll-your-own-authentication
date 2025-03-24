import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../state/use-auth-state'

export function useKeyboardShortcut() {
	const router = useRouter()
	const { isAuthenticated, logout } = useAuthStore()

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.shiftKey && event.key.toLowerCase() === 'l') {
				event.preventDefault()

				if (isAuthenticated) {
					logout()
					router.push('/')
				} else {
					router.push('/login')
				}
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [isAuthenticated, logout, router])
}
