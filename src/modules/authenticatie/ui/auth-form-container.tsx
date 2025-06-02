import { RegisterForm } from '@/app/(auth)/register/register-form';
import { Waves } from '@/components/effects/waves';
import { login } from '@/modules/authenticatie/server/mutations/login';
import { toast } from '@/shared/components/toast';
import { useTheme } from 'next-themes';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, Card, CardContent, Input, Label } from 'ui';
import { cn } from 'utilities';
import { GitHubLoginButton } from './github-login';
('use client');

function LoginButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending} className="w-full">
			{pending ? 'Logging in...' : 'Login'}
		</Button>
	);
}

interface AuthFormContainerProps extends React.ComponentProps<'div'> {
	defaultMode?: 'login' | 'register';
}

export function AuthFormContainer({
	className,
	defaultMode = 'login',
	...props
}: AuthFormContainerProps) {
	const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
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

	async function handleLoginSubmit(formData: FormData) {
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

	const switchToRegister = () => setMode('register');
	const switchToLogin = () => setMode('login');

	return (
		<div className={cn('flex min-h-screen items-center justify-center', className)} {...props}>
			<div className="w-full max-w-[720px] px-4">
				<Card className="overflow-hidden py-0">
					<CardContent className="grid p-0 md:grid-cols-2 h-full">
						<div className="relative overflow-hidden">
							{/* Login Form */}
							<div
								className={cn(
									'absolute inset-0 transition-transform duration-500 ease-in-out',
									mode === 'login' ? 'translate-x-0' : '-translate-x-full'
								)}
							>
								<form
									ref={formRef}
									action={handleLoginSubmit}
									className="pt-6 flex flex-col gap-6 p-6 md:p-8 h-full"
								>
									<div className="flex flex-col items-center text-center">
										<h1 className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 bg-clip-text text-transparent text-3xl font-bold animate-gradient-x">
											Welcome back
										</h1>
										<p className="text-balance text-muted-foreground">
											Login to your Acme Inc account
										</p>
									</div>

									<div className="grid gap-2">
										<Label htmlFor="login-email">Email</Label>
										<Input
											id="login-email"
											name="email"
											type="email"
											placeholder="m@example.com"
											required
										/>
									</div>

									<div className="grid gap-2">
										<Label htmlFor="login-password">Password</Label>
										<Input
											id="login-password"
											name="password"
											type="password"
											required
										/>
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
										9999999999999999999999999{' '}
										<Button
											variant="outline"
											className="w-full"
											onClick={() => console.log('Login with Google')}
										>
											{/* Google Icon */}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												className="h-4 w-4"
											>
												<path
													d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
													fill="currentColor"
												/>
											</svg>
										</Button>
										<Button
											variant="outline"
											className="w-full"
											onClick={() => console.log('Login with Meta')}
										>
											{/* Meta Icon */}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												className="h-4 w-4"
											>
												<path
													d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
													fill="currentColor"
												/>
											</svg>
											<span className="sr-only">Login with Meta</span>
										</Button>
									</div>

									<div className="text-center text-sm">
										Don&apos;t have an account?{' '}
										<button
											type="button"
											onClick={switchToRegister}
											className="underline underline-offset-4 hover:text-primary"
										>
											Sign up
										</button>
									</div>
								</form>
							</div>

							{/* Register Form */}
							<div
								className={cn(
									'absolute inset-0 transition-transform duration-500 ease-in-out',
									mode === 'register' ? 'translate-x-0' : 'translate-x-full'
								)}
							>
								<RegisterForm onSwitchToLogin={switchToLogin} />
							</div>
						</div>

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
