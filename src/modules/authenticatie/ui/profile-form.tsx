'use client';

import { toast } from '@/shared/components/toast';
import { TBaseUser } from '@/shared/types/base';
import { useTransition } from 'react';
import { Button, Icons, Input, Label } from 'ui';
import { useAuth } from '../hooks/use-auth';
import { updateProfile } from '../server/mutations/update-profile';
import { getCurrentUser } from '../server/queries/get-current-user';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';

export function ProfileForm() {
	const auth = useAuth();
	const [isPending, startTransition] = useTransition();

	if (auth.status !== 'authenticated') {
		return null;
	}

	async function onSubmit(formData: FormData) {
		startTransition(async () => {
			try {
				const result = await updateProfile(formData);

				if (result.success) {
					const updatedUser = await getCurrentUser();
					if (updatedUser) {
						auth.updateUser(updatedUser as TBaseUser);
						toast.success('Profile updated successfully');
					} else {
						toast.error('Failed to refresh user data');
					}
				} else {
					toast.error(result.error || 'Failed to update profile');
				}
			} catch (err) {
				toast.error(err instanceof Error ? err.message : 'An error occurred');
			}
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>Update your profile information.</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							name="name"
							defaultValue={auth.user.name || ''}
							disabled={isPending}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							defaultValue={auth.user.email}
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
					<Button type="submit" disabled={isPending}>
						{isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
						Update Profile
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
