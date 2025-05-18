'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';

export function UserInfo() {
	const auth = useAuth();

	if (auth.status === 'loading') {
		return (
			<div className="animate-pulse">
				<div className="h-4 w-24 bg-gray-200 rounded" />
			</div>
		);
	}

	if (auth.status === 'unauthenticated') {
		return <div>Not logged in</div>;
	}

	return (
		<div className="space-y-1">
			<div className="text-sm text-gray-500">Logged in as:</div>
			<div className="font-medium">{auth.user.email}</div>
			<div className="text-xs text-gray-400">Role: {auth.user.role}</div>
		</div>
	);
}
