'use client';

import { ThemeProvider } from '@/modules/theme/components';
import { TRPCProvider } from '@/modules/trpc/provider';
import { SidebarProvider } from '@/shared/components/ui';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
	return (
<TRPCProvider>			<ThemeProvider>
			<TooltipProvider>
				<SidebarProvider>
					{children}
				</SidebarProvider>
			</TooltipProvider>
		</ThemeProvider>
</TRPCProvider>
);
}
