'use client';

import { toast } from '@/shared/components/toast';
import { useState } from 'react';
import { Button, Icons } from 'ui';
import { generateGitHubAuthUrl } from '../server/mutations/github-login';

type TProps = {
	className?: string;
	redirectTo?: string;
};

export function GitHubLoginButton({ className, redirectTo = '/dashboard' }: TProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		try {
			setIsLoading(true);
			const url = await generateGitHubAuthUrl(redirectTo);
			window.location.href = url;
		} catch (error) {
			console.error('GitHub login error:', error);
			toast.error('Failed to initiate GitHub login');
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant="outline"
			onClick={handleLogin}
			disabled={isLoading}
			className={`bg-background border-border text-foreground hover:bg-muted hover:text-foreground ${className}`}
		>
			{isLoading ? (
				<Icons.spinner className="mr-2 h-4 w-4 animate-spin text-foreground" />
			) : (
				<Icons.gitHub className="mr-2 h-4 w-4 text-foreground" />
			)}
			Continue with GitHub
		</Button>
	);
}
