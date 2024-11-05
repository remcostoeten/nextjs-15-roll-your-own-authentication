import Logo from '@/components/logo'
import Tooltip from '@/components/tooltip'
import Link from 'next/link'
import React from 'react'

type AuthFormShellProps = {
	children: React.ReactNode
	variant: 'signin' | 'signup'
}

export default function AuthFormShell({
	children,
	variant
}: AuthFormShellProps) {
	return (
		<div className="w-full max-w-md p-8 bg-zinc-900 rounded-lg shadow-lg">
			<div className="text-center mb-8">
				<Tooltip
					content="@remcostoeten"
					position="top"
					id="auth-logo-tooltip"
				>
					<Logo fill="#E5E7EB" hasLink={false} />
				</Tooltip>

				<h2 className="mt-6 text-3xl font-bold text-white">
					{variant === 'signin'
						? 'Sign in to your account'
						: 'Create your account'}
				</h2>
			</div>
			{children}
			<p className="pt-4 text-center text-sm text-zinc-400">
				{variant === 'signin' ? (
					<>
						Don&apos;t have an account?{' '}
						<Link
							href="/sign-up"
							className="font-medium text-white hover:underline"
						>
							Sign up here
						</Link>
					</>
				) : (
					<>
						Already have an account?{' '}
						<Link
							href="/sign-in"
							className="font-medium text-white hover:underline"
						>
							Sign in here
						</Link>
					</>
				)}
			</p>
		</div>
	)
}
