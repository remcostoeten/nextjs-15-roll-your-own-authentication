'use client';

import { register } from '@/modules/authenticatie/server/mutations/register';
import { toast } from '@/shared/components/ui/toast';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, Card, CardContent, Checkbox, Input, Label } from 'ui';

function RegisterButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending} className="w-full">
			{pending ? 'Creating account...' : 'Register'}
		</Button>
	);
}

export default function RegisterPage() {
	const formRef = useRef<HTMLFormElement>(null);

	async function handleSubmit(formData: FormData) {
		try {
			const result = await register(formData);

			if (!result.success) {
				toast.error(result.message, result.error);
				formRef.current?.reset();
				return;
			}

			toast.success(result.message, 'Redirecting to dashboard...');
		} catch (e) {
			if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) return;

			toast.error(
				'Registration failed',
				e instanceof Error ? e.message : 'An unexpected error occurred'
			);
			formRef.current?.reset();
		}
	}

	return (
		<div className="flex justify-center mt-20 px-4">
			<Card className="w-full max-w-md">
				<CardContent className="p-6 md:p-8">
					<form ref={formRef} action={handleSubmit} className="space-y-6">
						<div className="text-center">
							<h1 className="text-2xl font-bold">Create an account</h1>
							<p className="text-muted-foreground text-sm">
								Sign up to get started with your account
							</p>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="you@example.com"
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

						<div className="flex items-center space-x-2">
							<Checkbox id="terms" name="terms" required />
							<Label htmlFor="terms" className="text-sm font-normal">
								I agree to the Terms and Conditions
							</Label>
						</div>

						<RegisterButton />

						<div className="text-center text-sm">
							Already have an account?{' '}
							<a
								href="/login"
								className="underline underline-offset-4 hover:text-primary"
							>
								Login here
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
