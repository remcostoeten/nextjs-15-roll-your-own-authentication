import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWorkspace } from '../hooks/use-workspace';
import { WorkspaceSwitcher } from './workspace-switcher';
import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { logout } from '@/modules/authenticatie/server/mutations/logout';
import { useTransition } from 'react';
import { toast } from '@/shared/components/toast';
import { Button, Icons } from 'ui';
('use client');

const navigation = [
	{
		name: 'Overview',
		href: '/dashboard',
		icon: Icons.home,
	},
	{
		name: 'Projects',
		href: '/dashboard/projects',
		icon: Icons.folder,
	},
	{
		name: 'Tasks',
		href: '/dashboard/tasks',
		icon: Icons.checkSquare,
	},
	{
		name: 'Members',
		href: '/dashboard/members',
		icon: Icons.users,
	},
	{
		name: 'Settings',
		href: '/dashboard/settings',
		icon: Icons.settings,
	},
];

export function WorkspaceSidebar() {
	const pathname = usePathname();
	const { currentWorkspace } = useWorkspace();
	const auth = useAuth();
	const [isPending, startTransition] = useTransition();

	const handleLogout = async () => {
		startTransition(async () => {
			try {
				const result = await logout();
				if (result.success) {
					toast.success('Logged out successfully');
					window.location.href = '/login';
				} else {
					toast.error('Failed to logout');
				}
			} catch (error) {
				toast.error('Failed to logout');
			}
		});
	};

	return (
		<div className="w-64 bg-[rgb(15,15,15)] border-r border-[rgb(28,28,28)] flex flex-col">
			{/* Workspace Switcher */}
			<div className="p-4 border-b border-[rgb(28,28,28)]">
				<WorkspaceSwitcher />
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-4">
				<ul className="space-y-2">
					{navigation.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;

						return (
							<li key={item.name}>
								<Link
									href={
										currentWorkspace
											? `${item.href}?workspace=${currentWorkspace.id}`
											: item.href
									}
									className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										isActive
											? 'bg-white text-black'
											: 'text-white/70 hover:text-white hover:bg-white/5'
									}`}
								>
									<Icon className="h-5 w-5" />
									<span>{item.name}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* User Menu */}
			<div className="p-4 border-t border-[rgb(28,28,28)]">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
							{auth.status === 'authenticated' && (
								<span className="text-sm font-medium text-white">
									{auth.user.name?.[0] || auth.user.email[0].toUpperCase()}
								</span>
							)}
						</div>
						{auth.status === 'authenticated' && (
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-white truncate">
									{auth.user.name || 'User'}
								</p>
								<p className="text-xs text-white/60 truncate">{auth.user.email}</p>
							</div>
						)}
					</div>
					<Button
						onClick={handleLogout}
						disabled={isPending}
						variant="ghost"
						size="sm"
						className="text-white/60 hover:text-white hover:bg-white/5"
					>
						{isPending ? (
							<Icons.spinner className="h-4 w-4 animate-spin" />
						) : (
							<Icons.logOut className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
