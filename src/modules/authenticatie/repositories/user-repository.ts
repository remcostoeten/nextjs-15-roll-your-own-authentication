import { db } from '@/api/db';
import { oauthAccounts, users } from '@/api/db/schema';
import type { TBaseUserWithPassword } from '@/shared/types/base';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { TAuthUser } from '../types';
import type { TOAuthAccount, TOAuthProvider } from '../types/oauth';

type TCreateUserData = Omit<TBaseUserWithPassword, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified' | 'lastLoginAt'>;
type TUpdateUserData = Partial<Omit<TBaseUserWithPassword, 'id' | 'createdAt' | 'updatedAt'>>;

const SALT_ROUNDS = 10;

export const userRepository = {
  async findByEmail(email: string): Promise<TAuthUser | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user as TAuthUser | null;
  },

  async findById(id: string): Promise<TAuthUser | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user as TAuthUser | null;
  },

  async create(data: TCreateUserData): Promise<TAuthUser> {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning();
    return user as TAuthUser;
  },

  async update(id: string, data: TUpdateUserData): Promise<TAuthUser> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user as TAuthUser;
  },

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  },

  async findAll(): Promise<TAuthUser[]> {
    const allUsers = await db
      .select()
      .from(users);
    return allUsers as TAuthUser[];
  },

  async validateCredentials(email: string, password: string): Promise<TAuthUser | null> {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then(rows => rows[0] as (TBaseUserWithPassword & TAuthUser) | undefined);

    if (!user || !user.password) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    // Update last login time
    await this.update(user.id, { lastLoginAt: new Date() });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  isAdmin(user: TAuthUser): boolean {
    return user.email === process.env.ADMIN_EMAIL || user.role === 'admin';
  },

  // OAuth-specific methods
  async findOAuthAccount(provider: TOAuthProvider, providerAccountId: string): Promise<TOAuthAccount | null> {
    const [account] = await db
      .select()
      .from(oauthAccounts)
      .where(eq(oauthAccounts.provider, provider))
      .where(eq(oauthAccounts.providerAccountId, providerAccountId));
    return account as TOAuthAccount | null;
  },

  async findUserOAuthAccounts(userId: string): Promise<TOAuthAccount[]> {
    const accounts = await db
      .select()
      .from(oauthAccounts)
      .where(eq(oauthAccounts.userId, userId));
    return accounts as TOAuthAccount[];
  },

  async linkOAuthAccount(userId: string, account: Omit<TOAuthAccount, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<TOAuthAccount> {
    const [oauthAccount] = await db
      .insert(oauthAccounts)
      .values({ ...account, userId })
      .returning();
    return oauthAccount as TOAuthAccount;
  },

  async unlinkOAuthAccount(userId: string, provider: TOAuthProvider): Promise<void> {
    await db
      .delete(oauthAccounts)
      .where(eq(oauthAccounts.userId, userId))
      .where(eq(oauthAccounts.provider, provider));
  },
};
