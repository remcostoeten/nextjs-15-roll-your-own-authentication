'use client'

import { useToast } from '@/components/primitives/toast'
import AuthFormWrapper from '@/features/authentication/components/auth-form-wrapper'
import { useAuth } from '@/features/authentication/context/auth-context'
import { login } from '@/features/authentication/mutations/login'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type LoginFormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { refetchUser } = useAuth()
  const toast = useToast()
  const { register, handleSubmit } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await login(data)
      
      if (result.success) {
        await refetchUser()
        toast.success('Login successful')
        router.push('/dashboard')
      } else {
        setError(result.error || 'Login failed')
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      setError('Login failed')
      toast.error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFormWrapper
      title="Login"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      submitText="Login"
      alternativeText="Don't have an account?"
      alternativeLink="/register"
      alternativeLinkText="Register"
      errorMessage={error}
    >
      <div className="space-y-4">
        <div>
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            {...register('password', { required: true })}
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </AuthFormWrapper>
  )
}
