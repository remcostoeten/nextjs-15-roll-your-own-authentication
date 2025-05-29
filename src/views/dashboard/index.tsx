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
		<div className="space-y-8">
			{/* Welcome Section */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
				<p className="text-muted-foreground">
					Here's what's happening with your projects today.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
					<div className="flex flex-row items-center justify-between space-y-0 pb-2">
						<h3 className="tracking-tight text-sm font-medium">Total Projects</h3>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78-7.78 5.5 5.5 0 0 0 7.78 7.78Z" />
						</svg>
					</div>
					<div className="space-y-1">
						<div className="text-2xl font-bold">12</div>
						<p className="text-xs text-muted-foreground">+2 from last month</p>
					</div>
				</div>

				<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
					<div className="flex flex-row items-center justify-between space-y-0 pb-2">
						<h3 className="tracking-tight text-sm font-medium">Active Tasks</h3>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
						</svg>
					</div>
					<div className="space-y-1">
						<div className="text-2xl font-bold">24</div>
						<p className="text-xs text-muted-foreground">+4 from yesterday</p>
					</div>
				</div>

				<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
					<div className="flex flex-row items-center justify-between space-y-0 pb-2">
						<h3 className="tracking-tight text-sm font-medium">Team Members</h3>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78-7.78 5.5 5.5 0 0 0 7.78 7.78Z" />
						</svg>
					</div>
					<div className="space-y-1">
						<div className="text-2xl font-bold">8</div>
						<p className="text-xs text-muted-foreground">+1 this week</p>
					</div>
				</div>

				<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
					<div className="flex flex-row items-center justify-between space-y-0 pb-2">
						<h3 className="tracking-tight text-sm font-medium">Completion Rate</h3>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
						</svg>
					</div>
					<div className="space-y-1">
						<div className="text-2xl font-bold">89%</div>
						<p className="text-xs text-muted-foreground">+5% from last week</p>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				{/* Recent Activity */}
				<div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm">
					<div className="p-6">
						<h3 className="text-lg font-semibold">Recent Activity</h3>
						<p className="text-sm text-muted-foreground">Your latest project updates</p>
					</div>
					<div className="p-6 pt-0">
						<div className="space-y-4">
							{[
								{ action: "Created new task", project: "Website Redesign", time: "2 hours ago" },
								{ action: "Updated project status", project: "Mobile App", time: "4 hours ago" },
								{ action: "Added team member", project: "API Development", time: "1 day ago" },
								{ action: "Completed milestone", project: "Database Migration", time: "2 days ago" },
							].map((activity, index) => (
								<div key={index} className="flex items-center space-x-4">
									<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium">{activity.action}</p>
										<p className="text-xs text-muted-foreground">{activity.project}</p>
									</div>
									<div className="text-xs text-muted-foreground">{activity.time}</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm">
					<div className="p-6">
						<h3 className="text-lg font-semibold">Quick Actions</h3>
						<p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
					</div>
					<div className="p-6 pt-0">
						<div className="space-y-3">
							<button
								onClick={() => router.push('/dashboard/projects')}
								className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
							>
								<span className="text-sm font-medium">Create New Project</span>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
							</button>
							<button
								onClick={() => router.push('/dashboard/tasks')}
								className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
							>
								<span className="text-sm font-medium">Add New Task</span>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
							</button>
							<button
								onClick={() => router.push('/dashboard/members')}
								className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
							>
								<span className="text-sm font-medium">Invite Team Member</span>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
							</button>
							<button
								onClick={() => router.push('/dashboard/profile')}
								className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
							>
								<span className="text-sm font-medium">Edit Profile</span>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
