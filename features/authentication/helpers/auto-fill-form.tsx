'use client'

import { Button } from '@/components/ui/button'
import { LogInIcon } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'react-hot-toast'

const TEST_EMAIL = process.env.NEXT_PUBLIC_TEST_EMAIL || 'demo@vercel.app'
const TEST_PASSWORD = process.env.NEXT_PUBLIC_TEST_PASSWORD || 'Vercel123!'

const AutoFillButton = () => {
	const handleAutoFill = useCallback(() => {
		try {
			const inputs = document.querySelectorAll('input')

			if (!inputs.length) {
				toast.error('No input fields found on the page')
				return
			}

			// Convert NodeList to Array for easier manipulation
			const inputArray = Array.from(inputs)
			let emailFilled = false
			let passwordCount = 0

			inputArray.forEach((input) => {
				// Check input type and position
				const inputType = input.type.toLowerCase()
				const isEmailField =
					inputType === 'email' ||
					input.name.toLowerCase().includes('email') ||
					input.id.toLowerCase().includes('email')

				// Create input event
				const event = new Event('input', { bubbles: true })

				if (isEmailField && !emailFilled) {
					input.value = TEST_EMAIL
					input.dispatchEvent(event)
					emailFilled = true
				} else if (
					inputType === 'password' ||
					input.name.toLowerCase().includes('password') ||
					input.id.toLowerCase().includes('password')
				) {
					input.value = TEST_PASSWORD
					input.dispatchEvent(event)
					passwordCount++
				}
			})

			// Show success toast with summary
			toast('Auto-filled email and password fields')
		} catch (error) {
			console.error('Auto-fill error:', error)
			toast.error('Auto-fill failed')
		}
	}, [])

	return (
		<div className="fixed top-1/2 right-4 -translate-y-1/2 z-50">
			<Button
				onClick={handleAutoFill}
				className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded shadow-lg"
			>
				<LogInIcon />{' '}
			</Button>
		</div>
	)
}

export default AutoFillButton
