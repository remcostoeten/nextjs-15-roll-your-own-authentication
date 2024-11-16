'use client'

import { useToast } from '@/components/primitives/toast'
import AuthFormWrapper from '@/features/authentication/components/auth-form-wrapper'
import { useAuth } from '@/features/authentication/context/auth-context'
import { login } from '@/features/authentication/mutations/login'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type LoginCredentials = {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginCredentials>()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) {
    return null
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const result = await login(data)
      
      if (result.success) {
        toast.success('Logged in successfully!')
        router.push('/dashboard')
      } else {
        setErrorMessage(result.error || 'Login failed')
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <AuthFormWrapper
      title="Login"
      onSubmit={onSubmit}
      submitText="Login"
      alternativeText="Don't have an account?"
      alternativeLink="/register"
      alternativeLinkText="Register"
      errorMessage={errorMessage}
    >
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="Email"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          placeholder="Password"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </AuthFormWrapper>
  )
}
