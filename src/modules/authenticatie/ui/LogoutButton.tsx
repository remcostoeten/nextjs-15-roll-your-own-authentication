'use client';

import { toast } from '@/shared/components/custom-toast';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { logout } from '../server/mutations/logout';

export function LogoutButton() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleLogout = async () => {
		startTransition(async () => {
			try {
				await logout();
				toast.success('Successfully logged out');
				router.replace('/login');
			} catch (error) {
				console.error('Error logging out:', error);
				toast.error('Failed to logout');
			}
		});
	};

	return (
		<Button onClick={handleLogout} variant="outline" disabled={isPending}>
			{isPending ? 'Logging out...' : 'Logout'}
		</Button>
	);
}
