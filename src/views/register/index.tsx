'use client';

import { RegisterForm } from '@/app/(auth)/register/register-form';
import { GitHubLoginButton } from '@/modules/authenticatie/ui/github-login';
import { GoogleLoginButton } from '@/modules/authenticatie/ui/google-login';
import { toast } from '@/shared/components/toast';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function RegisterView() {
	const searchParams = useSearchParams();

	useEffect(() => {
		const toastType = searchParams.get('toast');
		const message = searchParams.get('message');
		const error = searchParams.get('error');

		if (toastType === 'error' && message) {
			toast.error(message);
		}

		if (toastType || message || error) {
			const url = new URL(window.location.href);
			url.searchParams.delete('toast');
			url.searchParams.delete('message');
			url.searchParams.delete('error');
			window.history.replaceState({}, '', url);
		}
	}, [searchParams]);

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<Card className="w-full max-w-lg bg-background border-border shadow-2xl">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl text-foreground">Create an account</CardTitle>
					<CardDescription className="text-muted-foreground">
						Choose your preferred sign up method
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<GitHubLoginButton className="w-full" />
						<GoogleLoginButton className="w-full" />
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<RegisterForm />
				</CardContent>
			</Card>
		</div>
	);
}
