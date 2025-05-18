import { db } from 'db';
import { eq } from 'drizzle-orm';
import { users } from 'schema';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Database Connection', () => {
	beforeAll(async () => {
		// Ensure we can connect to the database
		await db.select().from(users).limit(1);
	});

	afterAll(async () => {
		// Clean up any test data if needed
		await db.delete(users).where(eq(users.email, 'test@example.com'));
	});

	it('should connect to the database', async () => {
		const result = await db.select().from(users).limit(1);
		expect(Array.isArray(result)).toBe(true);
	});
});
