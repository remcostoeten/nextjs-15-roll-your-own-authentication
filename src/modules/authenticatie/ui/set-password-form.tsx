'use client';

import { toast } from '@/shared/components/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, KeyRound, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from 'ui';
import { z } from 'zod';
import { setPassword } from '../server/mutations/set-password';

const formSchema = z
	.object({
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type FormValues = z.infer<typeof formSchema>;

type TProps = {
	onSuccess?: () => void;
};

export function SetPasswordForm({ onSuccess }: TProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState({
		password: false,
		confirmPassword: false,
	});

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: FormValues) {
		setIsLoading(true);
		try {
			const result = await setPassword(values.password);
			if (result.success) {
				toast.success('Password set successfully');
				form.reset();
				onSuccess?.();
			} else {
				toast.error(result.error || 'Failed to set password');
			}
		} catch (error) {
			console.error('Error setting password:', error);
			toast.error('Failed to set password');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
				<div className="flex justify-center mb-4">
					<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
						<KeyRound className="h-6 w-6 text-primary" />
					</div>
				</div>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<div className="relative">
								<FormControl>
									<Input
										type={showPassword.password ? 'text' : 'password'}
										placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
										{...field}
										className="pr-10"
									/>
								</FormControl>
								<button
									type="button"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									onClick={() =>
										setShowPassword({
											...showPassword,
											password: !showPassword.password,
										})
									}
								>
									{showPassword.password ? (
										<EyeOffIcon className="h-4 w-4" />
									) : (
										<EyeIcon className="h-4 w-4" />
									)}
								</button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<div className="relative">
								<FormControl>
									<Input
										type={showPassword.confirmPassword ? 'text' : 'password'}
										placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
										{...field}
										className="pr-10"
									/>
								</FormControl>
								<button
									type="button"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									onClick={() =>
										setShowPassword({
											...showPassword,
											confirmPassword: !showPassword.confirmPassword,
										})
									}
								>
									{showPassword.confirmPassword ? (
										<EyeOffIcon className="h-4 w-4" />
									) : (
										<EyeIcon className="h-4 w-4" />
									)}
								</button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full mt-6" disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Setting Password...
						</>
					) : (
						'Set Password'
					)}
				</Button>
			</form>
		</Form>
	);
}
