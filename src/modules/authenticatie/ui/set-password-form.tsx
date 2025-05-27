'use client';

import { Button } from '@/shared/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { toast } from '@/shared/components/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { setPassword } from '../server/mutations/set-password';
import { Icons } from 'ui';

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
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="••••••••" {...field} />
							</FormControl>
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
							<FormControl>
								<Input type="password" placeholder="••••••••" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? (
						<>
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
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
