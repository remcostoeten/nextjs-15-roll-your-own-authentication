import { users } from '@/api/db/schema';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.query.users.findFirst({
			where: eq(users.id, ctx.user.id),
		});

		if (!user) {
			throw new TRPCError({ code: 'NOT_FOUND' });
		}

		return user;
	}),

	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().min(2).optional(),
				avatar: z.string().url().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const updated = await ctx.db
				.update(users)
				.set({
					...input,
					updatedAt: new Date(),
				})
				.where(eq(users.id, ctx.user.id))
				.returning();

			return updated[0];
		}),
});
