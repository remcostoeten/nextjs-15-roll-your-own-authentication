import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Define the absolute path to the root database
const rootDbPath = path.join(process.cwd(), 'database.db');

// This script ensures that all parts of the application use the same database file
console.log('🔄 Fixing database paths and synchronizing database files...');

// 1. Update .env file to use absolute path
try {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');

    // Replace DATABASE_URL with absolute path
    const updatedEnvContent = envContent.replace(
        /DATABASE_URL=.*$/m,
        `DATABASE_URL="file:${rootDbPath}"`
    );

    fs.writeFileSync(envPath, updatedEnvContent);
    console.log('✅ Updated .env file with absolute database path');
} catch (error) {
    console.error('❌ Error updating .env file:', error);
}

// 2. Create symbolic links to the root database in key locations
const symbolicLinkLocations = [
    path.join(process.cwd(), 'apps', 'webapp', 'database.db'),
    path.join(process.cwd(), 'packages', 'db', 'database.db'),
    path.join(process.cwd(), 'packages', 'db', 'local.db')
];

// Remove existing database files and create symbolic links
for (const linkPath of symbolicLinkLocations) {
    try {
        // Make sure directory exists
        const dir = path.dirname(linkPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Remove existing file if it exists
        if (fs.existsSync(linkPath)) {
            fs.unlinkSync(linkPath);
            console.log(`✅ Removed existing database at ${linkPath}`);
        }

        // Create symbolic link
        fs.symlinkSync(rootDbPath, linkPath);
        console.log(`✅ Created symbolic link at ${linkPath} -> ${rootDbPath}`);
    } catch (error) {
        console.error(`❌ Error creating symbolic link at ${linkPath}:`, error);
    }
}

console.log('🎉 Database paths fixed! The application should now use a single database file.');
console.log('⚠️  Please restart your application for changes to take effect.'); 