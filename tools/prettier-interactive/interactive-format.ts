import { execSync, spawnSync } from 'child_process'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import os from 'os'

// ANSI color codes
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',

	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',

	bgBlack: '\x1b[40m',
	bgRed: '\x1b[41m',
	bgGreen: '\x1b[42m',
	bgYellow: '\x1b[43m',
	bgBlue: '\x1b[44m',
	bgMagenta: '\x1b[45m',
	bgCyan: '\x1b[46m',
	bgWhite: '\x1b[47m',
}

// Config file path
const configFilePath = path.join(os.homedir(), '.prettier-menu-config.json')

// Default configuration
let config = {
	ignoreFolders: [
		'node_modules',
		'.git',
		'dist',
		'build',
		'.next',
		'.vercel',
		'.turbo',
		'coverage',
	],
	defaultExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'json', 'css', 'scss'],
}

// Check if Prettier is installed
function checkPrettierInstallation() {
	try {
		// Try local installation first
		const localResult = spawnSync('npx', ['prettier', '--version'], {
			stdio: 'pipe',
		})
		if (localResult.status === 0) {
			const version = localResult.stdout.toString().trim()
			console.log(
				`${colors.green}Found Prettier ${version} (local)${colors.reset}`
			)
			return true
		}

		// Try global installation
		const globalResult = spawnSync('prettier', ['--version'], {
			stdio: 'pipe',
		})
		if (globalResult.status === 0) {
			const version = globalResult.stdout.toString().trim()
			console.log(
				`${colors.green}Found Prettier ${version} (global)${colors.reset}`
			)
			return true
		}

		console.log(
			`${colors.bgRed}${colors.white}WARNING: Prettier not found!${colors.reset}`
		)
		console.log(
			`${colors.yellow}Please install Prettier using:${colors.reset}`
		)
		console.log(
			`${colors.cyan}npm install --save-dev prettier${colors.reset} or ${colors.cyan}npm install -g prettier${colors.reset}`
		)
		return false
	} catch (error) {
		console.error(
			`${colors.red}Error checking Prettier:${colors.reset}`,
			error.message
		)
		return false
	}
}

// Load config file if exists
try {
	if (fs.existsSync(configFilePath)) {
		const fileConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf8'))
		config = { ...config, ...fileConfig }
	}
} catch (error) {
	console.error(
		`${colors.red}Error loading config:${colors.reset}`,
		error.message
	)
}

// Save config
function saveConfig() {
	try {
		fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2))
		console.log(
			`${colors.green}Configuration saved to ${configFilePath}${colors.reset}`
		)
	} catch (error) {
		console.error(
			`${colors.red}Error saving config:${colors.reset}`,
			error.message
		)
	}
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

// Helper function to execute prettier
function runPrettier(command, dryRun = false) {
	// Create explicit ignore file
	const tempIgnoreFile = path.join(os.tmpdir(), '.prettierignore-temp')
	try {
		fs.writeFileSync(
			tempIgnoreFile,
			config.ignoreFolders.map((folder) => `**/${folder}/**`).join('\n')
		)
	} catch {
		// Silently fail if cleanup fails
	}

	// Remove the curly braces from the glob pattern as they're not needed
	const cleanCommand = command.replace(/\{|\}/g, '')

	const fullCommand = dryRun
		? `npx prettier --check --ignore-path "${tempIgnoreFile}" ${cleanCommand}`
		: `npx prettier --write --ignore-path "${tempIgnoreFile}" ${cleanCommand}`

	console.log(`${colors.cyan}Executing:${colors.reset} ${fullCommand}`)

	try {
		execSync(fullCommand, { stdio: 'inherit' })
		console.log(
			dryRun
				? `${colors.yellow}Dry run completed. No files were changed.${colors.reset}`
				: `${colors.green}Formatting completed successfully!${colors.reset}`
		)
	} catch (error) {
		console.error(`${colors.red}Error:${colors.reset} ${error.message}`)
	} finally {
		// Clean up temp file
		try {
			fs.unlinkSync(tempIgnoreFile)
		} catch {
			// Silently fail if cleanup fails
		}
	}
}

// Fuzzy search for files/folders
async function fuzzySearch(searchPath = '.', searchTerm = '') {
	const items = []

	try {
		const entries = fs.readdirSync(searchPath, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = path.join(searchPath, entry.name)

			// Skip ignored folders
			if (
				entry.isDirectory() &&
				config.ignoreFolders.includes(entry.name)
			) {
				continue
			}

			if (
				(entry.isDirectory() || entry.isFile()) &&
				(!searchTerm ||
					entry.name.toLowerCase().includes(searchTerm.toLowerCase()))
			) {
				items.push({
					name: entry.name,
					path: fullPath,
					isDirectory: entry.isDirectory(),
				})
			}
		}

		// Sort directories first, then by name
		items.sort((a, b) => {
			if (a.isDirectory === b.isDirectory) {
				return a.name.localeCompare(b.name)
			}
			return a.isDirectory ? -1 : 1
		})

		return items
	} catch (error) {
		console.error(
			`${colors.red}Error searching:${colors.reset}`,
			error.message
		)
		return []
	}
}

// Display interactive selection menu
async function displaySelectionMenu(items, title) {
	if (items.length === 0) {
		console.log(`${colors.yellow}No matching items found${colors.reset}`)
		return null
	}

	console.log(
		`\n${colors.bright}${colors.cyan}=== ${title} ===${colors.reset}`
	)

	items.forEach((item, index) => {
		const icon = item.isDirectory ? '📁' : '📄'
		console.log(
			`${colors.green}${index + 1}${colors.reset}: ${icon} ${item.name}${item.isDirectory ? '/' : ''}`
		)
	})

	console.log(`${colors.yellow}0${colors.reset}: Cancel`)

	return new Promise((resolve) => {
		rl.question(
			`${colors.cyan}Select an option:${colors.reset} `,
			(answer) => {
				const index = parseInt(answer) - 1
				if (index === -1) {
					resolve(null)
				} else if (index >= 0 && index < items.length) {
					resolve(items[index])
				} else {
					console.log(`${colors.red}Invalid selection${colors.reset}`)
					resolve(null)
				}
			}
		)
	})
}

// Navigate directories for selection
async function navigateDirectories(startPath = '.', searchTerm = '') {
	let currentPath = startPath
	let selectedItem = null

	while (!selectedItem) {
		const items = await fuzzySearch(currentPath, searchTerm)
		searchTerm = '' // Clear search term after first search

		// Add parent directory option if not in root
		if (currentPath !== '.') {
			items.unshift({
				name: '..',
				path: path.dirname(currentPath),
				isDirectory: true,
			})
		}

		const selected = await displaySelectionMenu(
			items,
			`Browsing: ${currentPath}`
		)

		if (!selected) {
			return null // User cancelled
		}

		if (selected.isDirectory) {
			currentPath = selected.path
		} else {
			selectedItem = selected
		}
	}

	return selectedItem
}

// Define formatting options
const options = [
	{ key: '1', label: 'Format all files', action: formatAll },
	{ key: '2', label: 'Format by extension', action: formatByExtension },
	{ key: '3', label: 'Format specific directory', action: formatDirectory },
	{ key: '4', label: 'Format specific file', action: formatFile },
	{ key: '5', label: 'Format recursive from path', action: formatRecursive },
	{
		key: '6',
		label: 'Configure ignore folders',
		action: configureIgnoreFolders,
	},
	{
		key: '7',
		label: 'Configure default extensions',
		action: configureDefaultExtensions,
	},
	{
		key: '8',
		label: 'Show current configuration',
		action: showConfiguration,
	},
	{ key: 'q', label: 'Quit', action: quit },
]

// Display menu
function showMenu() {
	console.log(
		`\n${colors.bright}${colors.magenta}=== Prettier Formatting Menu ===${colors.reset}`
	)
	options.forEach((option) => {
		console.log(
			`${colors.green}${option.key}${colors.reset}: ${option.label}`
		)
	})
	console.log(
		`${colors.bright}${colors.magenta}==============================${colors.reset}\n`
	)

	rl.question(`${colors.cyan}Choose an option:${colors.reset} `, (answer) => {
		const option = options.find((opt) => opt.key === answer)
		if (option) {
			option.action()
		} else {
			console.log(
				`${colors.red}Invalid option, please try again.${colors.reset}`
			)
			showMenu()
		}
	})
}

// Format all files with default extensions
function formatAll() {
	const extensionPattern = config.defaultExtensions
		.map((ext) => `**/*.${ext}`)
		.join(' ')

	rl.question(
		`${colors.yellow}Run in dry mode? (y/N):${colors.reset} `,
		(dryRun) => {
			const isDryRun = dryRun.toLowerCase() === 'y'
			console.log(
				`${colors.cyan}Formatting all files with extensions: ${extensionPattern}...${colors.reset}`
			)
			runPrettier(extensionPattern, isDryRun)
			showMenu()
		}
	)
}

// Format by extension
function formatByExtension() {
	rl.question(
		`${colors.cyan}Enter file extension (without dot, e.g. "json" or multiple like "json,yml"):${colors.reset} `,
		(extensionInput) => {
			if (!extensionInput) {
				console.log(
					`${colors.yellow}No extension provided. Returning to menu.${colors.reset}`
				)
				showMenu()
				return
			}

			const extensions = extensionInput
				.split(',')
				.map((ext) => ext.trim())
			const extensionPattern = extensions
				.map((ext) => `**/*.${ext}`)
				.join(' ')

			rl.question(
				`${colors.yellow}Run in dry mode? (y/N):${colors.reset} `,
				(dryRun) => {
					const isDryRun = dryRun.toLowerCase() === 'y'
					console.log(
						`${colors.cyan}Formatting all ${extensionPattern} files...${colors.reset}`
					)
					runPrettier(extensionPattern, isDryRun)
					showMenu()
				}
			)
		}
	)
}

// Format specific directory with fuzzy search
async function formatDirectory() {
	console.log(
		`${colors.cyan}Starting directory browser. You can type to search for folders.${colors.reset}`
	)

	rl.question(
		`${colors.cyan}Enter search term (or press Enter to browse):${colors.reset} `,
		async (searchTerm) => {
			const directory = await navigateDirectories('.', searchTerm)

			if (!directory) {
				console.log(
					`${colors.yellow}No directory selected. Returning to menu.${colors.reset}`
				)
				showMenu()
				return
			}

			if (!directory.isDirectory) {
				console.log(
					`${colors.yellow}Selected item is not a directory. Returning to menu.${colors.reset}`
				)
				showMenu()
				return
			}

			rl.question(
				`${colors.cyan}Enter file extensions to format (comma separated, or Enter for defaults):${colors.reset} `,
				(extensions) => {
					const exts = extensions
						? extensions.split(',').map((ext) => ext.trim())
						: config.defaultExtensions

					const extensionPattern = exts
						.map((ext) => `${directory.path}/**/*.${ext}`)
						.join(' ')

					rl.question(
						`${colors.yellow}Run in dry mode? (y/N):${colors.reset} `,
						(dryRun) => {
							const isDryRun = dryRun.toLowerCase() === 'y'
							console.log(
								`${colors.cyan}Formatting ${extensionPattern} files in ${directory.path}...${colors.reset}`
							)
							runPrettier(extensionPattern, isDryRun)
							showMenu()
						}
					)
				}
			)
		}
	)
}

// Format specific file with fuzzy search
async function formatFile() {
	console.log(
		`${colors.cyan}Starting file browser. You can type to search for files.${colors.reset}`
	)

	rl.question(
		`${colors.cyan}Enter search term (or press Enter to browse):${colors.reset} `,
		async (searchTerm) => {
			const file = await navigateDirectories('.', searchTerm)

			if (!file || file.isDirectory) {
				console.log(
					`${colors.yellow}No file selected. Returning to menu.${colors.reset}`
				)
				showMenu()
				return
			}

			rl.question(
				`${colors.yellow}Run in dry mode? (y/N):${colors.reset} `,
				(dryRun) => {
					const isDryRun = dryRun.toLowerCase() === 'y'
					console.log(
						`${colors.cyan}Formatting ${file.path}...${colors.reset}`
					)
					runPrettier(`"${file.path}"`, isDryRun)
					showMenu()
				}
			)
		}
	)
}

// Format recursively from path
async function formatRecursive() {
	console.log(
		`${colors.cyan}Starting directory browser for recursive formatting. You can type to search for folders.${colors.reset}`
	)

	rl.question(
		`${colors.cyan}Enter search term (or press Enter to browse):${colors.reset} `,
		async (searchTerm) => {
			const directory = await navigateDirectories('.', searchTerm)

			if (!directory) {
				console.log(
					`${colors.yellow}No directory selected. Returning to menu.${colors.reset}`
				)
				showMenu()
				return
			}

			if (!directory.isDirectory) {
				console.log(
					`${colors.yellow}Selected item is not a directory. Returning to menu.${colors.reset}`
				)
				showMenu()
				return
			}

			rl.question(
				`${colors.cyan}Enter file extensions to format (comma separated, or Enter for defaults):${colors.reset} `,
				(extensions) => {
					const exts = extensions
						? extensions.split(',').map((ext) => ext.trim())
						: config.defaultExtensions

					const extensionPattern = exts
						.map((ext) => `${directory.path}/**/*.${ext}`)
						.join(' ')

					rl.question(
						`${colors.yellow}Run in dry mode? (y/N):${colors.reset} `,
						(dryRun) => {
							const isDryRun = dryRun.toLowerCase() === 'y'
							console.log(
								`${colors.cyan}Recursively formatting ${extensionPattern} files in ${directory.path}...${colors.reset}`
							)
							runPrettier(extensionPattern, isDryRun)
							showMenu()
						}
					)
				}
			)
		}
	)
}

// Configure ignore folders
function configureIgnoreFolders() {
	console.log(
		`${colors.cyan}Current ignored folders:${colors.reset} ${config.ignoreFolders.join(', ')}`
	)

	rl.question(
		`${colors.cyan}Enter new ignore folders (comma separated):${colors.reset} `,
		(foldersInput) => {
			if (foldersInput.trim()) {
				config.ignoreFolders = foldersInput
					.split(',')
					.map((folder) => folder.trim())
				saveConfig()
			}
			showMenu()
		}
	)
}

// Configure default extensions
function configureDefaultExtensions() {
	console.log(
		`${colors.cyan}Current default extensions:${colors.reset} ${config.defaultExtensions.join(', ')}`
	)

	rl.question(
		`${colors.cyan}Enter new default extensions (comma separated):${colors.reset} `,
		(extensionsInput) => {
			if (extensionsInput.trim()) {
				config.defaultExtensions = extensionsInput
					.split(',')
					.map((ext) => ext.trim())
				saveConfig()
			}
			showMenu()
		}
	)
}

// Show current configuration
function showConfiguration() {
	console.log(
		`\n${colors.bright}${colors.cyan}=== Current Configuration ===${colors.reset}`
	)
	console.log(
		`${colors.cyan}Ignored folders:${colors.reset} ${config.ignoreFolders.join(', ')}`
	)
	console.log(
		`${colors.cyan}Default extensions:${colors.reset} ${config.defaultExtensions.join(', ')}`
	)
	console.log(`${colors.cyan}Config file:${colors.reset} ${configFilePath}`)
	console.log(
		`${colors.bright}${colors.cyan}=========================${colors.reset}\n`
	)

	rl.question(
		`${colors.cyan}Press Enter to continue...${colors.reset}`,
		() => {
			showMenu()
		}
	)
}

// Quit the application
function quit() {
	console.log(`${colors.green}Exiting formatter menu.${colors.reset}`)
	rl.close()
}

// Display welcome message
console.log(
	`${colors.bright}${colors.cyan}Welcome to the Prettier Formatting Tool!${colors.reset}`
)
console.log(
	`${colors.dim}Configuration loaded from: ${configFilePath}${colors.reset}`
)

// Check Prettier installation before starting
if (!checkPrettierInstallation()) {
	console.log(
		`${colors.red}Please install Prettier before continuing.${colors.reset}`
	)
	process.exit(1)
}

// Start the menu
showMenu()
