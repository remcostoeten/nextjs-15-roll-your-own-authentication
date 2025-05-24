import type { TBaseUserWithPassword } from '@/shared/types/base';
import bcrypt from 'bcryptjs';
import { db } from 'db';
import { and, eq } from 'drizzle-orm';
import { env } from 'env';
import { oauthAccounts, users } from 'schema';
import type { TAuthUser } from '../types';
import type { TOAuthAccount, TOAuthProvider } from '../types/oauth';

type TCreateUserData = Omit<
	TBaseUserWithPassword,
	'id' | 'createdAt' | 'updatedAt' | 'emailVerified' | 'lastLoginAt'
>;
type TUpdateUserData = Partial<Omit<TBaseUserWithPassword, 'id' | 'createdAt' | 'updatedAt'>>;

export function userRepository() {
	return {
		async findByEmail(email: string): Promise<TAuthUser | null> {
			const result = await db.select().from(users).where(eq(users.email, email));
			return (result[0] ?? null) as TAuthUser | null;
		},

		async findById(id: string): Promise<TAuthUser | null> {
			const result = await db.select().from(users).where(eq(users.id, id));
			return (result[0] ?? null) as TAuthUser | null;
		},

		async create(data: TCreateUserData): Promise<TAuthUser> {
			const result = await db.insert(users).values(data).returning();
			if (!result[0]) throw new Error('Failed to create user');
			return result[0] as TAuthUser;
		},

		async update(id: string, data: TUpdateUserData): Promise<TAuthUser> {
			const result = await db
				.update(users)
				.set({ ...data, updatedAt: new Date() })
				.where(eq(users.id, id))
				.returning();
			if (!result[0]) throw new Error('User not found');
			return result[0] as TAuthUser;
		},

		async delete(id: string): Promise<void> {
			await db.delete(users).where(eq(users.id, id));
		},

		async findAll(): Promise<TAuthUser[]> {
			const result = await db.select().from(users);
			return result as TAuthUser[];
		},

		async validateCredentials(email: string, password: string): Promise<TAuthUser | null> {
			const result = await db
				.select()
				.from(users)
				.where(eq(users.email, email));

			const user = result[0] as (TBaseUserWithPassword & TAuthUser) | undefined;
			if (!user || !user.password) return null;

			const isValid = await bcrypt.compare(password, user.password);
			if (!isValid) return null;

			await this.update(user.id, { lastLoginAt: new Date() });

			const { password: _, ...userWithoutPassword } = user;
			return userWithoutPassword;
		},

		isAdmin(user: TAuthUser): boolean {
			return user.email === env.ADMIN_EMAIL || user.role === 'admin';
		},

		async findOAuthAccount(
			provider: TOAuthProvider,
			providerAccountId: string
		): Promise<TOAuthAccount | null> {
			const result = await db
				.select()
				.from(oauthAccounts)
				.where(
					and(
						eq(oauthAccounts.provider, provider),
						eq(oauthAccounts.providerAccountId, providerAccountId)
					)
				);
			return (result[0] ?? null) as TOAuthAccount | null;
		},

		async findUserOAuthAccounts(userId: string): Promise<TOAuthAccount[]> {
			const result = await db
				.select()
				.from(oauthAccounts)
				.where(eq(oauthAccounts.userId, userId));
			return result as TOAuthAccount[];
		},

		async linkOAuthAccount(
			userId: string,
			account: Omit<TOAuthAccount, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
		): Promise<TOAuthAccount> {
			const result = await db
				.insert(oauthAccounts)
				.values({ ...account, userId })
				.returning();
			if (!result[0]) throw new Error('Failed to link OAuth account');
			return result[0] as TOAuthAccount;
		},

		async unlinkOAuthAccount(userId: string, provider: TOAuthProvider): Promise<void> {
			await db
				.delete(oauthAccounts)
				.where(and(eq(oauthAccounts.userId, userId), eq(oauthAccounts.provider, provider)));
		},
	};
}
