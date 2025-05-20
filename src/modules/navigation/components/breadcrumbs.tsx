'use client';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import '@/styles/breadcrumbs.css';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const routeNameMap: Record<string, string> = {
	'': 'Home',
	dashboard: 'Dashboard',
	profile: 'My Profile',
	settings: 'Settings',
	projects: 'Projects',
	tasks: 'Tasks',
	analytics: 'Analytics',
};

export function Breadcrumbs() {
	const pathname = usePathname();
	const paths = pathname.split('/').filter(Boolean);

	// Function to get the accumulated href up to a certain index
	const getHref = (index: number) => `/${paths.slice(0, index + 1).join('/')}`;

	// Function to get the display name for a path segment
	const getDisplayName = (path: string, index: number) => {
		// If it's a dynamic segment (UUID), try to get a more friendly name
		if (path.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
			const parentPath = paths[index - 1];
			switch (parentPath) {
				case 'project':
					return 'Current Project';
				default:
					return path;
			}
		}
		return routeNameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
	};

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<Link href="/" passHref>
						<BreadcrumbLink className="flex items-center">
							<Home className="h-4 w-4" />
						</BreadcrumbLink>
					</Link>
				</BreadcrumbItem>
				{paths.map((path, index) => {
					const href = getHref(index);
					const isLast = index === paths.length - 1;
					const displayName = getDisplayName(path, index);

					return (
						<React.Fragment key={path}>
							<BreadcrumbSeparator>
								<ChevronRight className="h-4 w-4" />
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{displayName}</BreadcrumbPage>
								) : (
									<Link href={href} passHref>
										<BreadcrumbLink>{displayName}</BreadcrumbLink>
									</Link>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
