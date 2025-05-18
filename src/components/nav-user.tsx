'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/shared/components/ui/sidebar';
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function NavUser() {
	const { isMobile } = useSidebar();
	const auth = useAuth();
	const router = useRouter();

	if (auth.status !== 'authenticated') {
		return null;
	}

	const { user } = auth;

	const handleLogout = async () => {
		await auth.signOut();
		router.push('/login');
	};
	console.log(user);
	const getInitials = (name: string) => {
		return (
			name
				?.split(' ')
				.map((part) => part[0])
				.join('')
				.toUpperCase() || user.email.substring(0, 2).toUpperCase()
		);
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={user.avatar || undefined}
									alt={user.name || user.email}
								/>
								<AvatarFallback className="rounded-lg">
									{getInitials(user.name || '')}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{user.name || user.email}
								</span>
								<span className="truncate text-xs capitalize">{user.role}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.avatar || undefined}
/>
									<AvatarFallback className="rounded-lg">
										{getInitials(user.name || '')}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{user.name || user.email}
									</span>
									<span className="truncate text-xs capitalize">{user.role}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{user.role !== 'admin' && (
							<>
								<DropdownMenuGroup>
									<DropdownMenuItem onClick={() => router.push('/upgrade')}>
										<Sparkles className="mr-2 h-4 w-4" />
										Upgrade to Pro
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
							</>
						)}
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
								<BadgeCheck className="mr-2 h-4 w-4" />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
								<CreditCard className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
								<Bell className="mr-2 h-4 w-4" />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout} className="text-red-500">
							<LogOut className="mr-2 h-4 w-4 " />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
