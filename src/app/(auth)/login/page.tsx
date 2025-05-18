'use client';

import { login } from '@/modules/authenticatie/server/mutations/login';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

function LoginButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
		>
			{pending ? 'Logging in...' : 'Login'}
		</button>
	);
}

export default function LoginPage() {
	const [error, setError] = useState<string>('');
	const formRef = useRef<HTMLFormElement>(null);

	async function handleSubmit(formData: FormData) {
		setError('');
		try {
			await login(formData);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to login');
			formRef.current?.reset();
		}
	}

	return (
		<form ref={formRef} action={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
			<h1 className="text-xl font-bold">Login</h1>
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}
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
