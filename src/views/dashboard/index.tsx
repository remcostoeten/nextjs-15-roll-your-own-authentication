'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { logout } from '@/modules/authenticatie/server/mutations/logout';
import { toast } from '@/shared/components/toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function DashboardView() {
	const auth = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (auth.status === 'unauthenticated') {
			router.replace('/login');
		}
	}, [auth.status, router]);

	useEffect(() => {
		const success = searchParams.get('success');
		const welcome = searchParams.get('welcome');

		if (success === 'true') {
			if (welcome === 'true') {
				toast.success('Welcome to your new account! 🎉');
			}
			// Clean up the URL
			const url = new URL(window.location.href);
			url.searchParams.delete('success');
			url.searchParams.delete('welcome');
			window.history.replaceState({}, '', url);
		}
	}, [searchParams]);

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
			const result = await logout();
			if (result.success) {
				toast.success('Successfully logged out');
				router.replace('/login');
			} else {
				toast.error('Failed to logout');
			}
		} catch (error) {
			console.error('Error logging out:', error);
			toast.error('Failed to logout');
		}
	};

	return (
		<div className="space-y-6">
			<div className="bg-background bbb shadow-sm rounded-lg p-6">
				<h2 className="text-2xl font-bold text-gray-900">Welcome, {auth.user.email}!</h2>
				<p className="mt-2 text-gray-600">
					You are logged in as: <span className="font-medium">{auth.user.role}</span>
				</p>
			</div>

			<div className="bgdark-lighttext  bglight-darktext bbb shadow-sm rounded-lg p-6 contain">
				<h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
				<div className="space-y-4">
					<button
						onClick={() => router.push('/dashboard/profile')}
						className="w-full bg-background border text-foreground px-4 py-2 rounded-lg transition-colors text-left"
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
