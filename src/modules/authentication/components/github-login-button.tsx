'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { GithubIcon } from 'lucide-react'

export function GitHubLoginButton() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const handleClick = async () => {
		setIsLoading(true)
		
		// Simulate authentication delay
		await new Promise(resolve => setTimeout(resolve, 1000))
		
		// Mock successful authentication
		toast.success('Successfully connected with GitHub (Mock)')
		router.push('/dashboard')
		
		setIsLoading(false)
	}

	return (
		<Button
			onClick={handleClick}
			disabled={isLoading}
			variant="outline"
			className="w-full"
		>
			<GithubIcon className="mr-2 h-4 w-4" />
			{isLoading ? 'Connecting to GitHub...' : 'Continue with GitHub (Mock)'}
		</Button>
	)
}
