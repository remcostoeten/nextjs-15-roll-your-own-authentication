'use client'

import AuthFormWrapper from '@/features/authentication/components/auth-form-wrapper'
import { login } from '@/features/authentication/mutations/login'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type LoginCredentials = {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginCredentials>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = handleSubmit(async (data: LoginCredentials) => {
    setErrorMessage(null)
    const result = await login(data)
    
    if (result.success) {
      toast.success('Successfully logged in!')
      router.push('/dashboard')
    } else {
      const errorMsg = result.error || 'Login failed. Please try again.'
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
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
