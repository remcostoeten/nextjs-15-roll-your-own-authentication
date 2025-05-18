'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { Card } from '@/shared/components/ui/card';
import { useState } from 'react';

export default function DashboardPage() {
	const auth = useAuth();
	const [error, setError] = useState<string | null>(null);

	if (auth.status === 'loading') {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
			</div>
		);
	}

	if (auth.status === 'unauthenticated') {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Not authenticated</h1>
					<p className="text-gray-600">Please log in to access the dashboard.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Dashboard</h1>
			</div>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card className="p-6">
					<h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
					<p className="text-gray-600">
						This is your personal dashboard. More features coming soon.
					</p>
				</Card>
			</div>
		</div>
	);
}
