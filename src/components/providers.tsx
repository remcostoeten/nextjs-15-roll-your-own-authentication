'use client';

import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import * as React from 'react';
import { ThemeProvider } from './theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TooltipProvider>
			<ThemeProvider>
				<SidebarProvider>
{children}				</SidebarProvider>
			</ThemeProvider>
		</TooltipProvider>
	);
}
