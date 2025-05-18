'use client';

import { Button } from '@/shared/components/ui/button';
import { useTransition } from 'react';
import { logout } from '../server/mutations/logout';

export function LogoutButton() {
	const [isPending, startTransition] = useTransition();

	return (
		<form action={() => startTransition(() => logout())}>
			<Button type="submit" variant="outline" disabled={isPending}>
				{isPending ? 'Logging out...' : 'Logout'}
			</Button>
		</form>
	);
}
