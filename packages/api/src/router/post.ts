import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@acme/db/client";
import { Post, zCreatePost } from "@acme/db/schema";

import { publicProcedure } from "../trpc";

export const postRouter = {
  list: publicProcedure.query(async () => {
    return db.query.Post.findMany({
      orderBy: (post) => post.createdAt,
      columns: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),
  byId: publicProcedure.input(String).query(async (req) => {
    const post = await db.query.Post.findFirst({
      where: eq(Post.id, req.input),
      columns: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return post ?? null;
  }),
  create: publicProcedure.input(zCreatePost).mutation(async ({ input }) => {
    const newPosts = await db.insert(Post).values(input).returning();

    if (!newPosts[0]) {
      throw new Error("Failed to create post");
    }

    return newPosts[0];
  }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().max(256),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const updatedPosts = await db
        .update(Post)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(Post.id, id))
        .returning();

      if (!updatedPosts[0]) {
        throw new Error("Failed to update post");
      }

      return updatedPosts[0];
    }),
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      const deletedPosts = await db
        .delete(Post)
        .where(eq(Post.id, id))
        .returning();

      if (!deletedPosts[0]) {
        throw new Error("Failed to delete post");
      }

      return deletedPosts[0];
    }),
} satisfies TRPCRouterRecord;
