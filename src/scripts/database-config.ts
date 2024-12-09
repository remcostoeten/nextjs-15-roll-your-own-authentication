import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config()

const toggleDatabase = (useLocal: boolean) => {
    try {
        const envPath = path.join(process.cwd(), '.env')
        let envContent = fs.readFileSync(envPath, 'utf8')

        // Create backup
        fs.writeFileSync(`${envPath}.bak`, envContent)

        // Update USE_LOCAL_DB
        envContent = envContent.replace(
            /USE_LOCAL_DB=.*/,
            `USE_LOCAL_DB=${useLocal}`
        )

        fs.writeFileSync(envPath, envContent)
        console.log(`✅ Successfully switched to ${useLocal ? 'local Docker' : 'Vercel Postgres'} database`)
    } catch (error) {
        console.error('❌ Error updating database configuration:', error)
        process.exit(1)
    }
}

// Handle command line arguments
const arg = process.argv[2]
if (arg === 'local') {
    toggleDatabase(true)
} else if (arg === 'vercel') {
    toggleDatabase(false)
} else {
    console.error('❌ Invalid argument. Use "local" or "vercel"')
    process.exit(1)
} 