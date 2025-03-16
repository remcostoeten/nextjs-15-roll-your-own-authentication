'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { RegisterUserInput } from '@/modules/authentication/models/z.user'
import { RegisterForm } from '@/modules/authentication/components/register-form'

export function RegisterView() {
    const router = useRouter()

    const handleRegister = async (data: RegisterUserInput) => {
        try {


            toast.success('Registration successful!')
            router.push('/dashboard')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Registration failed')
        }
    }

    return <RegisterForm onSubmit={handleRegister} />
} 