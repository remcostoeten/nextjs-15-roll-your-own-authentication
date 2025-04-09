import { ChevronsUpDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/dashboard/sidebar/sidebar'
export function UserNavLoader() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg">
					<div className="relative">
						<Skeleton className="h-8 w-8 rounded-lg" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-3 w-32 mt-1" />
					</div>
					<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
