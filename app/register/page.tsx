'use client'

import { useToast } from '@/components/primitives/toast'
import AuthFormWrapper from '@/features/authentication/components/auth-form-wrapper'
import { useAuth } from '@/features/authentication/context/auth-context'
import { register } from '@/features/authentication/mutations/register'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type RegisterFormData = {
  email: string
  password: string
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { refetchUser } = useAuth()
  const toast = useToast()
  const { register: registerField, handleSubmit } = useForm<RegisterFormData>()

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 4000))
      
      const result = await register(data)
      
      if (result.success) {
        await refetchUser()
        toast.success('Registration successful')
        router.push('/dashboard')
      } else {
        setError(result.error || 'Registration failed')
        toast.error(result.error || 'Registration failed')
      }
    } catch (error) {
      setError('Registration failed')
      toast.error('Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFormWrapper
      title="Register"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      submitText="Create account"
      alternativeText="Already have an account?"
      alternativeLink="/login"
      alternativeLinkText="Login"
      errorMessage={error}
    >
      <div className="space-y-4">
        <div>
          <input
            {...registerField('email', { required: true })}
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            {...registerField('password', { required: true })}
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </AuthFormWrapper>
  )
}
