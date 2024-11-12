'use client'

import { signIn } from '@/features/auth/actions/sign-in.action'
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useRouter } from 'next/navigation'

export default function SignInForm() {
	const { setUser, setIsAuthenticated } = useAuth()
	const router = useRouter()

	const handleSubmit = async (formData: FormData) => {
		try {
			const result = await signIn(formData)
			if (result.user) {
				setUser(result.user)
				setIsAuthenticated(true)
				router.push('/dashboard')
			}
		} catch (error) {
			console.error('Sign in failed:', error)
		}
	}

	return <form action={handleSubmit}>{/* Your existing form fields */}</form>
}
