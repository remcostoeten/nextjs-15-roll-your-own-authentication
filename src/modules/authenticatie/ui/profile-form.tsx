'use client';

import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Icons } from '@/shared/components/ui/icons';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useState, useTransition } from 'react';
import { useAuth } from '../hooks/use-auth';
import { updateProfile } from '../server/mutations/update-profile';

export function ProfileForm() {
	const { user } = useAuth();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	async function onSubmit(formData: FormData) {
		setError(null);
		setSuccess(null);

		startTransition(async () => {
			try {
				if (!user) return;

				const result = await updateProfile(formData);

				if (result.success) {
					setSuccess('Profile updated successfully');
				} else {
					setError(result.error || 'Failed to update profile');
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			}
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>
					Update your profile information.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							name="name"
							defaultValue={user?.name || ''}
							disabled={isPending}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							defaultValue={user?.email}
							disabled={isPending}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="current-password">Current Password</Label>
						<Input
							id="current-password"
							name="current-password"
							type="password"
							disabled={isPending}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="new-password">New Password</Label>
						<Input
							id="new-password"
							name="new-password"
							type="password"
							disabled={isPending}
						/>
					</div>
					{error && (
						<div className="text-sm font-medium text-red-500">
							{error}
						</div>
					)}
					{success && (
						<div className="text-sm font-medium text-green-500">
							{success}
						</div>
					)}
					<Button type="submit" disabled={isPending}>
						{isPending && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						Update Profile
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
