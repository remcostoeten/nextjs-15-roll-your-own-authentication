import { login } from '@/modules/authenticatie/server/mutations/login';
import { toast } from '@/shared/components/toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, Input, Label } from 'ui';

function LoginButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" className="w-full" disabled={pending}>
			{pending ? 'Signing in...' : 'Sign in with Email'}
		</Button>
	);
}

export function LoginForm() {
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();

	async function handleSubmit(formData: FormData) {
		try {
			const result = await login(formData);
			if (result.success) {
				toast.success('Successfully logged in');
				router.push(result.redirect || '/dashboard');
			} else {
				toast.error(result.error || 'Failed to login');
				formRef.current?.reset();
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : 'Failed to login');
			formRef.current?.reset();
		}
	}

	return (
		<div className="grid gap-6">
			<form ref={formRef} action={handleSubmit} className="bg-background p-6 rounded-xl border border-border shadow-2xl">
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email" className="text-foreground">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="name@example.com"
							required
							className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password" className="text-foreground">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
							className="bg-muted border-border text-foreground"
						/>
					</div>
					<LoginButton />
				</div>
			</form>
			<div className="text-center text-sm">
				<span className="text-muted-foreground">Don't have an account? </span>
				<Link href="/register" className="text-foreground hover:text-foreground/90 underline-offset-4 hover:underline">
					Sign up
				</Link>
			</div>
		</div>
	);
}
