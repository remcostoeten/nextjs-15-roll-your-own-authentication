'use client';
import { Waves } from '@/components/effects/waves';
import { login } from '@/modules/authenticatie/server/mutations/login';
import { DiscordLoginButton } from '@/modules/authenticatie/ui/discord-login';
import { GitHubLoginButton } from '@/modules/authenticatie/ui/github-login';
import { GoogleLoginButton } from '@/modules/authenticatie/ui/google-login';
import { Flex } from '@/shared/components/flex';
import { toast } from '@/shared/components/toast';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Form, FormProvider } from 'react-hook-form';
import { Button, Card, CardContent, Input, Label, Spinner } from 'ui';
import { cn } from 'utilities';

/**
 * Renders a submit button for the login form, displaying a loading spinner and "Logging in..." text when the form submission is pending.
 */
function LoginButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending} className="w-full">
			{pending ? (
				<Flex center gap="xs">
					<Spinner size="md" color="white" />
					Logging in...
				</Flex>
			) : (
				'Login'
			)}
		</Button>
	);
}

/**
 * Renders the login form with email, password, and social login options, handling authentication and user feedback.
 *
 * Displays toast notifications for login success or failure, processes URL query parameters for error messages, and cleans up the URL after displaying messages. Includes links to registration, Terms of Service, and Privacy Policy.
 *
 * @param className - Optional additional CSS class names for the container.
 */
export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
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
			const result = await login(formData);

			if (!result.success) {
				toast.error(`Login failed - ${result.error || 'Authentication failed'}`);
				formRef.current?.reset();
				return;
			}

			toast.success('Login successful - Redirecting to dashboard...');
		} catch (e) {
			if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) return;
			toast.error(
				`Login failed - ${e instanceof Error ? e.message : 'An unexpected error occurred'}`
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
									Welcome back
								</h1>
								<p className="text-balance text-muted-foreground">
									Login to your ryoa panel
								</p>
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
								<Input id="password" name="password" type="password" required />
							</div>

							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="remember"
									name="remember"
									className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
								/>
								<Label
									htmlFor="remember"
									className="text-sm font-normal cursor-pointer"
								>
									Remember me
								</Label>
							</div>

							<LoginButton />

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
								Don&apos;t have an account?{' '}
								<Link href="register" className="underline underline-offset-4">
									Sign up
								</Link>
							</div>
						</form>

						<div className="relative hidden h-full min-h-[500px] bg-muted md:block overflow-hidden">
							<Waves
								lineColor={
									theme === 'dark'
										? 'rgba(255, 255, 255, 0.3)'
										: 'rgba(0, 0, 0, 0.3)'
								}
								backgroundColor="transparent"
								waveSpeedX={0.02}
								waveSpeedY={0.01}
							/>
						</div>
					</CardContent>
				</Card>

				<div className="mt-4 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
					By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
					<a href="#">Privacy Policy</a>.
				</div>
			</div>
		</div>
	);
}
