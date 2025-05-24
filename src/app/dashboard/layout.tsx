'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { Suspense } from 'react';
import DashboardLoading from './loading';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { status } = useAuth();

	if (status === 'loading') {
		return <DashboardLoading />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
			<Suspense fallback={<DashboardLoading />}>
				<main className="container mx-auto px-4 py-8">{children}</main>
			</Suspense>
		</div>
	);
}
