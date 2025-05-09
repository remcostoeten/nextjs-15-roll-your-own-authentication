import { db } from '@/api/db';
import { users } from '@/api/schema';
import { eq } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';
import { createToken } from '../lib/auth.service';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../api/models/z.user';

export async function login(data: LoginInput) {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
        return { error: 'Invalid input' };
    }

    const user = await db.query.users.findFirst({
        where: eq(users.email, validated.data.email),
    });

    if (!user) {
        return { error: 'Invalid credentials' };
    }

    const validPassword = await compare(validated.data.password, user.passwordHash || '');
    if (!validPassword) {
        return { error: 'Invalid credentials' };
    }

    await createToken({
        id: user.id.toString(),
        email: user.email || '',
        name: user.username || undefined
    });
    return { success: true };
}

export async function register(data: RegisterInput) {
    const validated = registerSchema.safeParse(data);
    if (!validated.success) {
        return { error: 'Invalid input' };
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, validated.data.email),
    });

    if (existingUser) {
        return { error: 'Email already in use' };
    }

    const hashedPassword = await hash(validated.data.password, 10);

    const user = await db.insert(users).values({
        email: validated.data.email,
        username: validated.data.name,
        passwordHash: hashedPassword,
        role: 'user',
    }).returning();

    await createToken({
        id: user[0].id.toString(),
        email: user[0].email || '',
        name: user[0].username || undefined
    });
    return { success: true };
} 