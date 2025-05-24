'use client';

import { Button } from '@/shared/components/ui/button';
import { Icons } from '@/shared/components/ui/icons';
import { useState } from 'react';
import { generateGitHubAuthUrl } from '../server/mutations/github-login';

type TGitHubLoginButtonProps = {
	className?: string;
	redirectTo?: string;
};

export function GitHubLoginButton({
	className,
	redirectTo = '/dashboard',
}: TGitHubLoginButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		try {
			setIsLoading(true);
			const url = await generateGitHubAuthUrl(redirectTo);
			window.location.href = url;
		} catch (error) {
			console.error('GitHub login error:', error);
			setIsLoading(false);
		}
	};

	return (
		<Button variant="outline" onClick={handleLogin} disabled={isLoading} className={className}>
			{isLoading ? (
				<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
			) : (
				<Icons.gitHub className="mr-2 h-4 w-4" />
			)}
			Continue with GitHub
		</Button>
	);
}
