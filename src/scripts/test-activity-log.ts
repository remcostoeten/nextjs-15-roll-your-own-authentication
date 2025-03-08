/**
 * Test Script for Activity Logging
 * 
 * This script tests the activity logging functionality directly.
 * Run it with: node -r esbuild-register ./src/scripts/test-activity-log.ts
 */

import { db } from '@/server/db';
import { logActivity } from '@/modules/user-metrics/api';
import { activityLogs } from '@/server/db/schemas';
import { count as countFn } from 'drizzle-orm';

async function testActivityLogging() {
    console.log('Starting activity logging test...');

    try {
        // Get the first user from the database to use for testing
        const firstUser = await db.query.users.findFirst();

        if (!firstUser) {
            console.error('No users found in the database. Please create a user first.');
            process.exit(1);
        }

        console.log(`Found user: ${firstUser.id} (${firstUser.email})`);

        // Log a test activity
        console.log('Attempting to log test activity...');
        const result = await logActivity({
            userId: firstUser.id,
            action: 'Test Activity',
            details: 'This is a test activity log from the test script'
        });

        if (result) {
            console.log('Activity log created successfully!');
            console.log('Activity log details:', result);
        } else {
            console.error('Failed to create activity log.');
        }

        // Count activity logs
        const countResult = await db.select({ count: countFn() }).from(activityLogs);
        const totalLogs = countResult[0]?.count || 0;

        console.log(`Total activity logs in database: ${totalLogs}`);

    } catch (error) {
        console.error('Error in test script:', error);
    } finally {
        // Close the database connection
        process.exit(0);
    }
}

// Run the test
testActivityLogging(); 