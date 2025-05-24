'use client';

import { register } from '@/modules/authenticatie/server/mutations/register';
import { toast } from '@/shared/components/toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

function RegisterButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full bg-[rgb(21,21,21)] text-white px-4 py-2 rounded-lg hover:bg-[rgb(28,28,28)] disabled:opacity-50 transition-colors border border-[rgb(28,28,28)]"
		>
			{pending ? (
				<div className="flex items-center justify-center">
					<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
					Creating account...
				</div>
			) : (
				'Create Account'
			)}
		</button>
	);
}

export default function RegisterPage() {
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	async function handleSubmit(formData: FormData) {
		try {
			const result = await register(formData);
			if (result.success) {
				toast.success('Account created successfully');
				startTransition(() => {
					router.push(result.redirect || '/dashboard');
				});
			} else {
				toast.error(result.error || 'Failed to create account');
				formRef.current?.reset();
			}
		} catch (e) {
			if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) {
				startTransition(() => {
					router.push('/dashboard');
				});
			} else {
				toast.error(e instanceof Error ? e.message : 'Failed to register');
				formRef.current?.reset();
			}
		}
	}

	if (isPending) {
		return (
			<div className="min-h-[400px] flex items-center justify-center bg-[rgb(11,11,11)]">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
					<p className="text-white/60">Setting up your account...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 bg-[rgb(11,11,11)] p-8 rounded-xl border border-[rgb(21,21,21)] shadow-2xl max-w-md mx-auto">
			<div className="text-center">
				<h1 className="text-2xl font-bold text-white">Create your account</h1>
				<p className="text-white/60 mt-2">Start your journey with us</p>
			</div>

			<form ref={formRef} action={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="email" className="block text-sm font-medium text-white/90">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						className="w-full bg-[rgb(15,15,15)] border border-[rgb(21,21,21)] rounded-lg px-3 py-2 text-white/90 placeholder:text-white/40 focus:outline-hidden focus:ring-2 focus:ring-white/10 focus:border-transparent"
						placeholder="you@example.com"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="password" className="block text-sm font-medium text-white/90">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						className="w-full bg-[rgb(15,15,15)] border border-[rgb(21,21,21)] rounded-lg px-3 py-2 text-white/90 focus:outline-hidden focus:ring-2 focus:ring-white/10 focus:border-transparent"
						placeholder="••••••••"
					/>
					<p className="text-sm text-white/40">Must be at least 8 characters</p>
				</div>

				<RegisterButton />
			</form>

			<div className="text-center text-sm">
				<span className="text-white/60">Already have an account?</span>{' '}
				<Link href="/login" className="text-white hover:text-white/90 font-medium">
					Sign in
				</Link>
			</div>
		</div>
	);
}
