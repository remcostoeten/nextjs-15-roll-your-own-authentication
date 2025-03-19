'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { GithubIcon } from 'lucide-react'
import { githubAuthMutation } from '../api/mutations/github-auth'
import { env } from 'env'

export function GitHubLoginButton() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const code = searchParams.get('code')
		if (code) {
			handleGitHubCallback(code)
		}
	}, [searchParams])

	const handleGitHubCallback = async (code: string) => {
		try {
			setIsLoading(true)
			const result = await githubAuthMutation(code)

			if (result.success) {
				toast.success('Successfully connected with GitHub')
				router.push('/dashboard')
			} else {
				toast.error(result.message || 'Failed to connect with GitHub')
			}
		} catch (error) {
			toast.error('An error occurred while connecting with GitHub')
			console.error('GitHub callback error:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleClick = () => {
		const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

		if (!clientId) {
			toast.error('GitHub OAuth is not configured')
			return
		}

		const params = new URLSearchParams({
			client_id: clientId,
			redirect_uri: `${baseUrl}/auth/login`,
			scope: 'user:email',
		})

		window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`
	}

	return (
		<Button
			onClick={handleClick}
			disabled={isLoading}
			variant="outline"
			className="w-full"
		>
			<GithubIcon className="mr-2 h-4 w-4" />
			{isLoading ? 'Connecting to GitHub...' : 'Continue with GitHub'}
		</Button>
	)
}
