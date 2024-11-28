import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'yaml'
import { copyToClipboard } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to update env file
function updateEnvFile(url) {
	const envPath = path.join(process.cwd(), '.env')

	try {
		// Read existing .env content
		let envContent = ''
		if (fs.existsSync(envPath)) {
			envContent = fs.readFileSync(envPath, 'utf8')
		}

		// Create backup
		fs.writeFileSync(`${envPath}.bak`, envContent)

		// Replace or add DATABASE_URL
		const envLines = envContent.split('\n')
		const dbUrlIndex = envLines.findIndex((line) =>
			line.startsWith('DATABASE_URL=')
		)

		if (dbUrlIndex >= 0) {
			envLines[dbUrlIndex] = url
		} else {
			envLines.push(url)
		}

		// Write back to .env
		fs.writeFileSync(envPath, envLines.join('\n'))
		console.log('Successfully updated .env file')
	} catch (error) {
		console.error('Error updating .env file:', error.message)
		throw error
	}
}

try {
	const compose = yaml.parse(
		fs.readFileSync(path.join(process.cwd(), 'docker-compose.yml'), 'utf8')
	)
	const db = compose.services.db.environment

	// Extract values without the ${..:-..} syntax
	const user = db.POSTGRES_USER.split(':-')[1].replace('}', '')
	const password = db.POSTGRES_PASSWORD.split(':-')[1].replace('}', '')
	const dbName = db.POSTGRES_DB.split(':-')[1].replace('}', '')

	const url = `DATABASE_URL=postgresql://${user}:${password}@localhost:5432/${dbName}`

	// Copy to clipboard
	copyToClipboard(url)
	console.log(url + ' (Copied to clipboard!)')

	// Update .env file
	updateEnvFile(url)
	console.log('DATABASE_URL has been updated in .env file')
} catch (error) {
	console.error('Error:', error.message)
	process.exit(1)
}
