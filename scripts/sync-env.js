const fs = require('fs')
const path = require('path')

const envFile = path.join(__dirname, '..', '.env')
const envExampleFile = path.join(__dirname, '..', '.env.example')

// Read the current .env file
const currentEnv = fs.existsSync(envFile)
	? fs.readFileSync(envFile, 'utf8')
	: ''

// Read the .env.example file
const exampleEnv = fs.readFileSync(envExampleFile, 'utf8')

// Merge the two, preferring values from the current .env
const mergedEnv = exampleEnv
	.split('\n')
	.map((line) => {
		const [key] = line.split('=')
		if (!key) return line

		const currentValue = currentEnv
			.split('\n')
			.find((l) => l.startsWith(`${key}=`))
		return currentValue || line
	})
	.join('\n')

// Write the merged content back to .env
fs.writeFileSync(envFile, mergedEnv)

console.log('.env file has been updated with values from .env.example')
