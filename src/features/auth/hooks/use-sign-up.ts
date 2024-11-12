'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { SignUpSchema } from '../validations/models/sign-up.z'

export function useSignUp() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function signUp(data: SignUpSchema) {
    try {
      setIsPending(true)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create account')
      }

      toast.success('Account created successfully')
      router.push('/sign-in')
    } catch (error) {
      toast.error('Failed to create account')
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return {
    signUp,
    isPending
  }
} 
