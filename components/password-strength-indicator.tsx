'use client'

import { cn } from 'helpers'
import { useEffect, useState } from 'react'

type PasswordStrength = {
  score: number // 0-4
  feedback: string
}

type PasswordStrengthIndicatorProps = {
  password: string
  className?: string
}

export default function PasswordStrengthIndicator({
  password,
  className
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<PasswordStrength>({ score: 0, feedback: '' })

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, feedback: '' })
      return
    }

    // Calculate password strength
    const hasLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)

    let score = 0
    if (hasLength) score++
    if (hasNumber) score++
    if (hasSpecial) score++
    if (hasUpper && hasLower) score++

    const feedbacks = [
      'Very weak',
      'Weak',
      'Fair',
      'Good',
      'Strong'
    ]

    setStrength({
      score,
      feedback: feedbacks[score]
    })
  }, [password])

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={cn(
              'h-2 w-full rounded-full transition-all duration-300',
              {
                'bg-red-500': strength.score === 1 && index === 0,
                'bg-orange-500': strength.score === 2 && index <= 1,
                'bg-yellow-500': strength.score === 3 && index <= 2,
                'bg-green-500': strength.score === 4 && index <= 3,
                'bg-gray-200 dark:bg-gray-700': index >= strength.score
              }
            )}
          />
        ))}
      </div>
      {strength.feedback && (
        <p className={cn('text-xs', {
          'text-red-500': strength.score === 1,
          'text-orange-500': strength.score === 2,
          'text-yellow-500': strength.score === 3,
          'text-green-500': strength.score === 4
        })}>
          {strength.feedback}
        </p>
      )}
    </div>
  )
} 
