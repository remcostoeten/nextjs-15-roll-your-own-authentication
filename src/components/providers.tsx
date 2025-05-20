'use client';

import { ThemeProvider } from '@/modules/theme/components';
import { SidebarProvider } from '@/shared/components/ui';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<TooltipProvider>
				<SidebarProvider>
					{children}
				</SidebarProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
}
