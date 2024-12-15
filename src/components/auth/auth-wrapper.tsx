'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Github } from 'lucide-react'
import { Logo } from '../theme/logo'
import { toast } from 'sonner'

type AuthWrapperProps = {
	children: ReactNode
	type: 'login' | 'register'
}

export function AuthWrapper({ children, type }: AuthWrapperProps) {
	const handleGithubLogin = async () => {
		try {
			window.location.href = '/api/auth/github'
		} catch (error) {
			console.error('GitHub login failed:', error)
			toast.error('GitHub login failed')
		}
	}

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<Logo className="mx-auto h-6 w-6" />
					<h1 className="text-2xl font-semibold tracking-tight">
						{type === 'login'
							? 'Welcome back'
							: 'Create an account'}
					</h1>
					<p className="text-sm text-muted-foreground">
						{type === 'login' ? (
							<>
								Don&apos;t have an account?{' '}
								<Link
									href="/register"
									className="underline underline-offset-4 hover:text-primary"
								>
									Sign up
								</Link>
							</>
						) : (
							<>
								Already have an account?{' '}
								<Link
									href="/login"
									className="underline underline-offset-4 hover:text-primary"
								>
									Sign in
								</Link>
							</>
						)}
					</p>
				</div>

				<div className="grid gap-6">
					{children}

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={handleGithubLogin}
						className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
					>
						<Github className="mr-2 h-4 w-4" />
						GitHub
					</button>
				</div>
			</div>
		</div>
	)
}
