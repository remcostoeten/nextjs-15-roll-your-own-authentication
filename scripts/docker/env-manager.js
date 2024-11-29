import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'yaml'
import readline from 'readline'
import crypto from 'crypto'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create readline interface
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

// Promisify readline question
const question = (query) =>
	new Promise((resolve) => rl.question(query, resolve))

// Color logging function
const log = {
	red: (msg) => console.log(chalk.red(msg)),
	green: (msg) => console.log(chalk.green(msg)),
	blue: (msg) => console.log(chalk.blue(msg)),
	yellow: (msg) => console.log(chalk.yellow(msg))
}

// Clipboard function (you'll need to implement based on your utils.js)
async function copyToClipboard(text) {
	// Implementation depends on your existing utils.js
	// This is a placeholder
	console.log('Text copied to clipboard')
}

// Function to choose env file
async function chooseEnvFile() {
	const envFiles = ['.env', '.env.local'].filter((file) =>
		fs.existsSync(path.join(process.cwd(), file))
	)

	if (envFiles.length === 0) {
		throw new Error('No .env or .env.local file found!')
	}

	if (envFiles.length === 1) {
		return envFiles[0]
	}

	log.blue('Multiple .env files found. Please choose:')
	envFiles.forEach((file, index) => {
		console.log(`${index + 1}) ${file}`)
	})

	const answer = await question('#? ')
	const choice = parseInt(answer) - 1

	if (choice >= 0 && choice < envFiles.length) {
		return envFiles[choice]
	} else {
		throw new Error('Invalid selection')
	}
}

// Function to update env file
async function updateEnvFile(key, value, envFile) {
	const envPath = path.join(process.cwd(), envFile)

	try {
		// Read existing content
		let envContent = ''
		if (fs.existsSync(envPath)) {
			envContent = fs.readFileSync(envPath, 'utf8')
		}

		// Create backup
		if (envContent) {
			fs.writeFileSync(`${envPath}.bak`, envContent)
		}

		// Check if key exists
		const hasExisting = new RegExp(`^${key}=`, 'm').test(envContent)

		if (hasExisting) {
			log.yellow(
				`Existing ${key} found in ${envFile}. Do you want to replace it? (y/n)`
			)
			const response = await question('')

			if (response.toLowerCase() === 'y') {
				// Replace existing entry
				const envLines = envContent.split('\n')
				const updatedLines = envLines.map((line) =>
					line.startsWith(`${key}=`) ? `${key}=${value}` : line
				)
				envContent = updatedLines.join('\n')

				fs.writeFileSync(envPath, envContent)
				log.green(`Updated ${key} in ${envFile}`)
			}
		} else {
			// Add newline if file doesn't end with one
			if (envContent && !envContent.endsWith('\n')) {
				envContent += '\n'
			}
			envContent += `${key}=${value}\n`

			fs.writeFileSync(envPath, envContent)
			log.green(`Added ${key} to ${envFile}`)
		}

		// Ensure proper permissions
		fs.chmodSync(envPath, 0o600)
	} catch (error) {
		log.red(`Error updating env file: ${error.message}`)
		throw error
	}
}

// Function to generate JWT secret
function generateJwtSecret() {
	return crypto.randomBytes(32).toString('hex')
}

// Function to extract database URL from docker-compose
function extractDatabaseUrl() {
	const composePath = path.join(process.cwd(), 'docker-compose.yml')

	if (!fs.existsSync(composePath)) {
		throw new Error('docker-compose.yml not found!')
	}

	const compose = yaml.parse(fs.readFileSync(composePath, 'utf8'))
	const db = compose.services.db.environment

	const user = db.POSTGRES_USER.split(':-')[1].replace('}', '')
	const password = db.POSTGRES_PASSWORD.split(':-')[1].replace('}', '')
	const dbName = db.POSTGRES_DB.split(':-')[1].replace('}', '')

	return `postgresql://${user}:${password}@localhost:5432/${dbName}`
}

// Main menu function
async function mainMenu() {
	while (true) {
		log.blue('What would you like to do?')
		console.log(
			'1) Generate new JWT secret. ❗Overwrites your current clipboard with the new secret 🚨'
		)
		console.log('2) Extract database URL from docker-compose.yml')
		console.log('3) Exit')

		const choice = await question('')

		try {
			switch (choice) {
				case '1': {
					const secret = generateJwtSecret()
					await copyToClipboard(secret)
					log.green(
						'Generated new JWT secret and copied to clipboard!'
					)
					log.yellow(`JWT_SECRET=${secret}`)

					const envFile = await chooseEnvFile()
					await updateEnvFile('JWT_SECRET', secret, envFile)
					break
				}

				case '2': {
					const dbUrl = extractDatabaseUrl()
					await copyToClipboard(dbUrl)
					log.green('Extracted database URL and copied to clipboard!')
					log.yellow(`DATABASE_URL=${dbUrl}`)

					const envFile = await chooseEnvFile()
					await updateEnvFile('DATABASE_URL', dbUrl, envFile)
					break
				}

				case '3': {
					log.blue('Goodbye!')
					rl.close()
					process.exit(0)
				}

				default: {
					log.red('Invalid option')
				}
			}
		} catch (error) {
			log.red(`Error: ${error.message}`)
		}

		console.log()
		log.blue('Press Enter to continue or Ctrl+C to exit...')
		await question('')
		console.clear()
	}
}

// Check for Node.js
if (!process.versions.node) {
	log.red('Node.js is required but not installed!')
	process.exit(1)
}

// Start the program
mainMenu().catch((error) => {
	log.red(`Fatal error: ${error.message}`)
	process.exit(1)
})
