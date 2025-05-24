'use client';

import { GitHubLoginButton } from '@/modules/authenticatie/ui/GitHubLoginButton';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<Card className="w-full max-w-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">Welcome back</CardTitle>
					<CardDescription>Choose your preferred sign in method</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<GitHubLoginButton className="w-full" />

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

					<LoginForm />
				</CardContent>
			</Card>
		</div>
	);
}
