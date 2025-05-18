'use client';

import { login } from '@/modules/authenticatie/server/mutations/login';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/toast';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom';

function LoginButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			disabled={pending}
		>
			{pending ? 'Logging in...' : 'Login'}
		</Button>
	);
}

export default function LoginPage() {
	const formRef = useRef<HTMLFormElement>(null);

	async function handleSubmit(formData: FormData) {
		try {
			const result = await login(formData);

			if (!result.success) {
				toast.error(result.message, result.error);
				formRef.current?.reset();
				return;
			}

			// Show success toast - though this might not be seen due to redirect
			toast.success(result.message, 'Redirecting to dashboard...');
		} catch (e) {
			// This will catch redirect errors, which we can ignore
			if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) {
				return;
			}

			toast.error(
				'Login failed',
				e instanceof Error ? e.message : 'An unexpected error occurred'
			);
			formRef.current?.reset();
		}
	}

	return (
		<form ref={formRef} action={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
			<h1 className="text-xl font-bold">Login</h1>
			<input
				name="email"
				type="email"
				placeholder="Email"
				required
				className="w-full border rounded px-3 py-2"
			/>
			<input
				name="password"
				type="password"
				placeholder="Password"
				required
				className="w-full border rounded px-3 py-2"
			/>
			<LoginButton />
		</form>
	);
}
