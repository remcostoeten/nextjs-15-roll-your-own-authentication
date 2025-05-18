import { beforeAll } from 'vitest';

// Mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/test_db';
process.env.ADMIN_EMAIL = 'admin@test.com';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_token_secret';

beforeAll(() => {
	// Any additional setup if needed
});
