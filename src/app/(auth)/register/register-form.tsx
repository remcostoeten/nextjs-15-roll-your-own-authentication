'use client'
import { Waves } from '@/components/effects/waves';
import { register } from '@/modules/authenticatie/server/mutations/register';
import { DiscordLoginButton } from '@/modules/authenticatie/ui/discord-login';
import { GitHubLoginButton } from '@/modules/authenticatie/ui/github-login';
import { GoogleLoginButton } from '@/modules/authenticatie/ui/google-login';
import { toast } from '@/shared/components/toast';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, Card, CardContent, Input, Label } from 'ui';
import { cn } from 'utilities';


function RegisterButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending} className="w-full">
			{pending ? 'Creating account...' : 'Create account'}
		</Button>
	);
}

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
	const formRef = useRef<HTMLFormElement>(null);
	const { theme } = useTheme();
	const searchParams = useSearchParams();

	useEffect(() => {
		const toastType = searchParams.get('toast');
		const message = searchParams.get('message');
		const error = searchParams.get('error');

		if (toastType === 'error' && message) {
			toast.error(`${message}`);
		}

		if (toastType || message || error) {
			const url = new URL(window.location.href);
			url.searchParams.delete('toast');
			url.searchParams.delete('message');
			url.searchParams.delete('error');
			window.history.replaceState({}, '', url);
		}
	}, [searchParams]);

	async function handleSubmit(formData: FormData) {
		try {
			const result = await register(formData);

			if (!result?.success) {
				toast.error(result?.error || 'Failed to create account');
				formRef.current?.reset();
				return;
			}

			toast.success('Account created successfully! Redirecting to dashboard...');

			if (result.redirect) {
				window.location.href = result.redirect;
			}
		} catch (e) {
			if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) return;
			toast.error(
				`Registration failed - ${
					e instanceof Error ? e.message : 'An unexpected error occurred'
				}`
			);
			formRef.current?.reset();
		}
	}

	return (
		<div className={cn('flex min-h-screen items-center justify-center', className)} {...props}>
			<div className="w-full max-w-[720px] px-4">
				<Card className="overflow-hidden py-0">
					<CardContent className="grid p-0 md:grid-cols-2 h-full">
						<form
							ref={formRef}
							action={handleSubmit}
							className="pt-6 flex flex-col gap-6 p-6 md:p-8"
						>
							<div className="flex flex-col items-center text-center">
								<h1 className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 bg-clip-text text-transparent text-3xl font-bold animate-gradient-x">
									Create an account
								</h1>
								<p className="text-balance text-muted-foreground">
									Sign up for your account
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="John Doe"
									required
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="m@example.com"
									required
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="••••••••"
									required
								/>
							</div>

							<RegisterButton />

							<div className="pb-6 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
								<span className="relative z-10 bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>

							<div className="grid grid-cols-3 gap-4">
								<GitHubLoginButton className="w-full" />
								<GoogleLoginButton className="w-full" />
								<DiscordLoginButton className="w-full" />
							</div>

							<div className="text-center text-sm">
								Already have an account?{' '}
								<Link href="/login" className="underline underline-offset-4">
									Login here
								</Link>
							</div>
						</form>

						<div className="relative hidfden h-full min-h-[500px] bg-muted md:block overflow-hidden">
							<Waves
								backgroundColor="transparent"
								waveSpeedX={0.02}
								waveSpeedY={0.01}
							/>
						</div>
					</CardContent>
				</Card>

				<div className="mt-4 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
					By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{' '}
					<Link href="#">Privacy Policy</Link>.
				</div>
			</div>
		</div>
	);
}
