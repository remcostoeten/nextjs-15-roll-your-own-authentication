import type { AppRouter } from '@/server/root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 1000,
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				loggerLink({
					enabled: () => process.env.NODE_ENV === 'development',
				}),
				httpBatchLink({
					url: '/api/trpc',
					transformer: superjson,
				}),
			],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
