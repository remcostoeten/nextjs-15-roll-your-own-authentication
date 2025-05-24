'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { logout } from '@/modules/authenticatie/server/mutations/logout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
	const auth = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (auth.status === 'unauthenticated') {
			router.replace('/login');
		}
	}, [auth.status, router]);

	if (auth.status === 'loading') {
		return (
			<div className="space-y-4">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/4"></div>
					<div className="mt-4 space-y-3">
						<div className="h-4 bg-gray-200 rounded w-3/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
					</div>
				</div>
			</div>
		);
	}

	if (auth.status !== 'authenticated') {
		return null;
	}

	const handleLogout = async () => {
		try {
			await logout();
			router.replace('/login');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="bg-white shadow rounded-lg p-6">
				<h2 className="text-2xl font-bold text-gray-900">Welcome, {auth.user.email}!</h2>
				<p className="mt-2 text-gray-600">
					You are logged in as: <span className="font-medium">{auth.user.role}</span>
				</p>
			</div>

			<div className="bg-white shadow rounded-lg p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
				<div className="space-y-4">
					<button
						onClick={() => router.push('/dashboard/profile')}
						className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors text-left"
					>
						Edit Profile
					</button>
					<button
						onClick={handleLogout}
						className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-colors text-left"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}
