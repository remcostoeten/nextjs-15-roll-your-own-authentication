import { userRepository } from '@/api/db/user-repository';
import { db } from 'db';
import { eq } from 'drizzle-orm';
import { register } from 'modules/authenticatie/server/mutations/register';
import { users } from 'schema';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Next.js redirect
vi.mock('next/navigation', () => ({
	redirect: vi.fn(),
}));

// Mock session creation
vi.mock('../../src/modules/authenticatie/helpers/session', () => ({
	createSession: vi.fn(),
}));

// Mock FormData since we're in Node environment
global.FormData = class FormData {
	private data: Record<string, string> = {};
	append(key: string, value: string) {
		this.data[key] = value;
	}
	get(key: string) {
		return this.data[key];
	}
} as any;

describe('Register Mutation', () => {
	const testEmail = 'test@example.com';
	const testPassword = 'TestPassword123!';

	beforeEach(async () => {
		// Clean up any existing test user
		await db.delete(users).where(eq(users.email, testEmail));
		vi.clearAllMocks();
	});

	afterEach(async () => {
		// Clean up after each test
		await db.delete(users).where(eq(users.email, testEmail));
		vi.clearAllMocks();
	});

	it('should register a new user successfully', async () => {
		const formData = new FormData();
		formData.append('email', testEmail);
		formData.append('password', testPassword);

		await register(formData);

		const user = await userRepository.findByEmail(testEmail);
		expect(user).toBeTruthy();
		expect(user?.email).toBe(testEmail);
		expect(user?.role).toBe('user');
		expect(user?.avatar).toBeTruthy(); // Should have a random avatar
	});

	it('should create admin user if email matches ADMIN_EMAIL', async () => {
		const adminEmail = process.env.ADMIN_EMAIL;
		if (!adminEmail) {
			console.warn('ADMIN_EMAIL not set, skipping admin user test');
			return;
		}

		const formData = new FormData();
		formData.append('email', adminEmail);
		formData.append('password', testPassword);

		await register(formData);

		const user = await userRepository.findByEmail(adminEmail);
		expect(user).toBeTruthy();
		expect(user?.role).toBe('admin');
	});

	it('should throw error if email is missing', async () => {
		const formData = new FormData();
		formData.append('password', testPassword);

		await expect(register(formData)).rejects.toThrow('Missing credentials');
	});

	it('should throw error if password is missing', async () => {
		const formData = new FormData();
		formData.append('email', testEmail);

		await expect(register(formData)).rejects.toThrow('Missing credentials');
	});

	it('should throw error if email is already in use', async () => {
		// First registration
		const formData = new FormData();
		formData.append('email', testEmail);
		formData.append('password', testPassword);
		await register(formData);

		// Second registration with same email
		await expect(register(formData)).rejects.toThrow('Email already in use');
	});
});
