'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { RegisterUserInput } from '@/modules/authentication/models/z.user'
import { RegisterForm } from '@/modules/authentication/components/register-form'
import dynamic from 'next/dynamic'

function RegisterView() {
	const router = useRouter()

	const handleRegister = async (data: RegisterUserInput) => {
		try {
			toast.success('Registration successful!')
			router.push('/dashboard')
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Registration failed'
			)
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<div className="w-full max-w-md">
				<h1 className="mb-8 text-center text-3xl font-bold">
					Create an account
				</h1>
				<RegisterForm onSubmit={handleRegister} />
			</div>
		</div>
	)
}

export default dynamic(() => Promise.resolve(RegisterView), {
	ssr: false,
})
