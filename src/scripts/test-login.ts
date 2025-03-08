/**
 * Test Script for Login Process
 * 
 * This script tests the login process and ensures that activity logging works.
 * Run it with: NODE_PATH=./src node -r esbuild-register ./src/scripts/test-login.ts
 */

import { db } from '@/server/db';
import { loginUser } from '@/modules/authentication/api/mutations/login-user';
import { activityLogs } from '@/server/db/schemas';
import { count as countFn } from 'drizzle-orm';

async function testLogin() {
    console.log('Starting login test...');

    try {
        // Get the first user from the database to use for testing
        const firstUser = await db.query.users.findFirst();

        if (!firstUser) {
            console.error('No users found in the database. Please create a user first.');
            process.exit(1);
        }

        console.log(`Found user: ${firstUser.id} (${firstUser.email})`);

        // Count activity logs before login
        const beforeCount = await db.select({ count: countFn() }).from(activityLogs);
        const logsBefore = beforeCount[0]?.count || 0;
        console.log(`Activity logs before login: ${logsBefore}`);

        // Test credentials - this will fail without the actual password
        // In a real test, you would use a known test user with a known password
        console.log('Attempting to login...');
        try {
            const result = await loginUser({
                email: firstUser.email,
                password: 'Password123', // This is just a guess and will likely fail
            }, {
                userAgent: 'Test Script User Agent',
                ipAddress: '127.0.0.1'
            });

            console.log('Login successful!');
            console.log('Login result:', result);
        } catch (error: any) {
            console.error('Login failed (expected if password is incorrect):', error.message);
            console.log('But activity logging might still work if the error is after that step...');
        }

        // Count activity logs after login attempt
        const afterCount = await db.select({ count: countFn() }).from(activityLogs);
        const logsAfter = afterCount[0]?.count || 0;
        console.log(`Activity logs after login attempt: ${logsAfter}`);

        if (logsAfter > logsBefore) {
            console.log(`SUCCESS: ${logsAfter - logsBefore} new activity logs were created during login process!`);
        } else {
            console.log('No new activity logs were created during login process.');
        }

        // Show latest activity log
        const latestLog = await db.query.activityLogs.findFirst({
            orderBy: (logs, { desc }) => [desc(logs.createdAt)],
        });

        if (latestLog) {
            console.log('Latest activity log:', latestLog);
        }

    } catch (error) {
        console.error('Error in test script:', error);
    } finally {
        // Close the database connection
        process.exit(0);
    }
}

// Run the test
testLogin(); 