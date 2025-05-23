import type { db } from '@/api/db/connection';
import type { TUser } from '@/api/db/user-repository';
import { TRPCError, initTRPC } from '@trpc/server';
import type { NextRequest } from 'next/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

export type TContext = {
	user: TUser | null;
	db: typeof db;
	req: NextRequest;
};

const t = initTRPC.context<TContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({
		ctx: {
			user: ctx.user,
		},
	});
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
