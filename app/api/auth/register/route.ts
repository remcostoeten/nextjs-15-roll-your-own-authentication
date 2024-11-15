import { db } from '@/db';
import { profiles, users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Start a transaction to ensure both user and profile are created
    const result = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
        })
        .returning();

      await tx.insert(profiles).values({
        userId: user.id,
        isAdmin: email === process.env.ADMIN_EMAIL,
        socials: {},
      });

      return user;
    });

    return NextResponse.json({ 
      message: 'User created successfully',
      role: result.role
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Check if it's a unique constraint violation
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}
