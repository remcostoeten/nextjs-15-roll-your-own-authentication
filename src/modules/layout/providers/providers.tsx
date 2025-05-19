'use client';

import { ThemeProvider } from '@/modules/theme/components';
import { type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			{children}
		</ThemeProvider>
	);
}
