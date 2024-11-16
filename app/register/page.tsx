'use client'

import { useToast } from '@/components/primitives/toast'
import AuthFormWrapper from '@/features/authentication/components/auth-form-wrapper'
import { useAuth } from '@/features/authentication/context/auth-context'
import { register } from '@/features/authentication/mutations/register'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type RegisterFormData = {
  email: string
  password: string
}

export default function RegisterPage() {
  const { user } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const { register: registerField, handleSubmit } = useForm<RegisterFormData>()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // If user is authenticated, don't render the register form
  if (user) {
    return null
  }

  const onSubmit = handleSubmit(async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const result = await register(data)
      
      if (result.success) {
        toast.success('Account created successfully!')
        router.push('/dashboard')
      } else {
        setErrorMessage(result.error || 'Registration failed')
        toast.error(result.error || 'Registration failed')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <AuthFormWrapper
      title="Register"
      onSubmit={onSubmit}
      submitText="Create Account"
      alternativeText="Already have an account?"
      alternativeLink="/login"
      alternativeLinkText="Sign in"
      errorMessage={errorMessage}
    >
      <input
        {...registerField('email', { required: true })}
        type="email"
        placeholder="Email"
        className="input"
      />
      <input
        {...registerField('password', { required: true })}
        type="password"
        placeholder="Password"
        className="input"
      />
    </AuthFormWrapper>
  )
}
