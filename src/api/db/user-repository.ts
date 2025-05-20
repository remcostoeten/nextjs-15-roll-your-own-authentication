import { db } from '@/api/db/connection';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { TUserRole, UserRole, users } from './schema';
export { noteMentions, noteMentionsRelations, notes, notesRelations } from '../schemas/notes-scheme';
export type TUser = {
	id: string;
	email: string;
	role: TUserRole;
	name: string | null;
	avatar: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	lastLoginAt: Date | null;
};

export type CreateUserData = {
	email: string;
	password: string;
	role?: TUserRole;
	name?: string | null;
	avatar?: string | null;
};

export type UpdateUserData = Partial<{
	email: string;
	password: string;
	role: TUserRole;
	name: string | null;
	avatar: string | null;
	lastLoginAt: Date | null;
	updatedAt: Date | null;
}>;

const SALT_ROUNDS = 10;

export const userRepository = {
	findById: async (id: string): Promise<TUser | null> => {
		const [user] = await db
			.select({
				id: users.id,
				email: users.email,
				role: users.role,
				name: users.name,
				avatar: users.avatar,
				createdAt: users.createdAt,
				updatedAt: users.updatedAt,
				lastLoginAt: users.lastLoginAt,
			})
			.from(users)
			.where(eq(users.id, id));
		return user ? { ...user, role: user.role as TUserRole } : null;
	},

	findByEmail: async (email: string) => {
		const [user] = await db.select().from(users).where(eq(users.email, email));
		return user ?? null;
	},

	create: async (data: CreateUserData): Promise<TUser> => {
		try {
			const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
			const now = new Date();

			const [user] = await db
				.insert(users)
				.values({
					email: data.email,
					password: hashedPassword,
					role: data.role ?? UserRole.USER,
					name: data.name ?? null,
					avatar: data.avatar ?? null,
					createdAt: now,
					updatedAt: now,
				})
				.returning({
					id: users.id,
					email: users.email,
					role: users.role,
					name: users.name,
					avatar: users.avatar,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
					lastLoginAt: users.lastLoginAt,
				});

			if (!user) {
				throw new Error('Failed to create user');
			}

			return { ...user, role: user.role as TUserRole };
		} catch (error) {
			console.error('Error creating user:', error);
			throw new Error('Failed to create user account');
		}
	},

	update: async (id: string, data: UpdateUserData): Promise<TUser | null> => {
		const updateData: UpdateUserData = {
			...data,
			updatedAt: new Date(),
		};

		if (data.password) {
			updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
		}

		const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning({
			id: users.id,
			email: users.email,
			role: users.role,
			name: users.name,
			avatar: users.avatar,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt,
			lastLoginAt: users.lastLoginAt,
		});
		return user ? { ...user, role: user.role as TUserRole } : null;
	},

	findAll: async (): Promise<TUser[]> => {
		const allUsers = await db
			.select({
				id: users.id,
				email: users.email,
				role: users.role,
				name: users.name,
				avatar: users.avatar,
				createdAt: users.createdAt,
				updatedAt: users.updatedAt,
				lastLoginAt: users.lastLoginAt,
			})
			.from(users);
		return allUsers.map(user => ({ ...user, role: user.role as TUserRole }));
	},

	delete: async (id: string) => {
		const [user] = await db.delete(users).where(eq(users.id, id)).returning({
			id: users.id,
			email: users.email,
		});
		return user ?? null;
	},

	validateCredentials: async (email: string, password: string) => {
		const user = await userRepository.findByEmail(email);
		if (!user) return null;

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) return null;

		// Update last login time
		await userRepository.update(user.id, { lastLoginAt: new Date() });

		return user;
	},

	isAdmin: (user: TUser): boolean => {
		return user.email === process.env.ADMIN_EMAIL || user.role === UserRole.ADMIN;
	},
};
