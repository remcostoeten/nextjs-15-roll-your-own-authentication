'use client';

import { toast } from '@/shared/components/toast';
import { useState } from 'react';
import { Button, Icons } from 'ui';
import { generateGoogleAuthUrl } from '../server/mutations/google-login';

type TProps = {
	className?: string;
	redirectTo?: string;
};

export function GoogleLoginButton({ className, redirectTo = '/dashboard' }: TProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		try {
			setIsLoading(true);
			const url = await generateGoogleAuthUrl(redirectTo);
			window.location.href = url;
		} catch (error) {
			console.error('Google login error:', error);
			toast.error('Failed to initiate Google login');
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
				<Icons.google className="mr-2 h-4 w-4" />
			)}
			Continue with Google
		</Button>
	);
}
