import { db } from '@/api/db/connection';
import { getUserFromRequest } from '@/modules/authenticatie/server/queries/get-user';
import { appRouter } from '@/server/root';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
	const user = await getUserFromRequest(req);

	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext: async () => ({
			user,
			db,
			req,
		}),
	});
};

export { handler as GET, handler as POST };
