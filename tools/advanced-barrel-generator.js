#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

const IGNORE_PATTERNS = [
	'node_modules',
	'.next',
	'dist',
	'.git',
	'.cache',
	'public',
]

const EXPORT_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']
const IGNORED_FILES = [
	'index.ts',
	'index.tsx',
	'index.js',
	'index.jsx',
	'.d.ts',
]
const TARGET_DIRS = process.argv.slice(2).length
	? process.argv.slice(2)
	: ['src']

const EXCLUDE_PATTERNS = [
	/Props$/, // Skip component props interfaces
	/[a-z]Variants$/, // Skip variant utilities like badgeVariants
]

const shouldExcludeExport = (exportName) => {
	return EXCLUDE_PATTERNS.some((pattern) => pattern.test(exportName))
}

const isDirectory = async (path) => {
	try {
		const stats = await stat(path)
		return stats.isDirectory()
	} catch (e) {
		return false
	}
}

const extractComponentExports = async (filePath) => {
	try {
		const content = await readFile(filePath, 'utf8')

		const exportNames = new Set()

		// Match export function declarations
		const exportFunctions = content.match(
			/export\s+function\s+([A-Za-z0-9_]+)/g
		)
		if (exportFunctions) {
			exportFunctions.forEach((match) => {
				const parts = match.split(/\s+/)
				if (parts.length >= 3) {
					const exportName = parts[2]
					// Skip excluded patterns
					if (!shouldExcludeExport(exportName)) {
						exportNames.add(exportName)
					}
				}
			})
		}

		// Match export const/let/var declarations
		const exportVariables = content.match(
			/export\s+(?:const|let|var)\s+([A-Za-z0-9_]+)/g
		)
		if (exportVariables) {
			exportVariables.forEach((match) => {
				const parts = match.split(/\s+/)
				if (parts.length >= 3) {
					const exportName = parts[2]
					// Skip excluded patterns
					if (!shouldExcludeExport(exportName)) {
						exportNames.add(exportName)
					}
				}
			})
		}

		// Match export class/interface/type declarations
		const exportTypes = content.match(
			/export\s+(?:class|interface|type|enum)\s+([A-Za-z0-9_]+)/g
		)
		if (exportTypes) {
			exportTypes.forEach((match) => {
				const parts = match.split(/\s+/)
				if (parts.length >= 3) {
					const exportName = parts[2]
					// Skip excluded patterns
					if (!shouldExcludeExport(exportName)) {
						exportNames.add(exportName)
					}
				}
			})
		}

		// Match named export blocks (handles both inline and multiline)
		const exportBlocks = content.match(/export\s*{[^}]*}/gs)
		if (exportBlocks) {
			exportBlocks.forEach((block) => {
				// Remove 'export {' and '}' parts and normalize whitespace
				const cleanedBlock = block
					.replace(/export\s*{/, '')
					.replace(/}/, '')
					.replace(/\s+/g, ' ')
					.trim()

				// Split by comma to get individual exports
				const exports = cleanedBlock
					.split(',')
					.map((e) => e.trim())
					.filter(Boolean)

				exports.forEach((exp) => {
					// Handle 'as' syntax: export { X as Y }
					const asMatch = exp.match(
						/([A-Za-z0-9_]+)(?:\s+as\s+([A-Za-z0-9_]+))?/
					)
					if (asMatch) {
						// If there's an alias (X as Y), use Y, otherwise use X
						const exportName = asMatch[2] || asMatch[1]
						if (exportName && !shouldExcludeExport(exportName)) {
							exportNames.add(exportName)
						}
					}
				})
			})
		}

		return Array.from(exportNames)
	} catch (error) {
		console.error(`Error parsing file ${filePath}:`, error)
		return []
	}
}

const getFilesInDir = async (dir) => {
	try {
		const items = await readdir(dir)
		const results = []

		for (const item of items) {
			if (IGNORE_PATTERNS.some((pattern) => item.includes(pattern)))
				continue

			const fullPath = path.join(dir, item)
			const isDir = await isDirectory(fullPath)

			if (isDir) {
				// Check if directory has files that should be exported
				const dirFiles = await readdir(fullPath)
				const hasExportableFiles = dirFiles.some(
					(file) =>
						EXPORT_EXTENSIONS.includes(path.extname(file)) &&
						!IGNORED_FILES.includes(file)
				)

				if (hasExportableFiles) {
					results.push({ path: fullPath, isDirectory: true })
				}

				// Recursively check subdirectories
				const subResults = await getFilesInDir(fullPath)
				results.push(...subResults)
			} else if (
				EXPORT_EXTENSIONS.includes(path.extname(item)) &&
				!IGNORED_FILES.includes(item)
			) {
				results.push({ path: fullPath, isDirectory: false })
			}
		}

		return results
	} catch (error) {
		console.error(`Error scanning directory ${dir}:`, error)
		return []
	}
}

const generateBarrelFile = async (dir) => {
	try {
		console.log(`Processing directory: ${dir}`)
		const items = await readdir(dir)
		const exportableItems = items.filter(
			(item) =>
				EXPORT_EXTENSIONS.includes(path.extname(item)) &&
				!IGNORED_FILES.includes(item)
		)

		if (exportableItems.length === 0) {
			console.log(`No exportable files found in ${dir}`)
			return
		}

		// Process each file to find exports
		const exports = []

		for (const file of exportableItems) {
			const filePath = path.join(dir, file)
			const fileName = path.basename(file, path.extname(file))

			// Special case handling for known components
			if (fileName === 'json-viewer') {
				exports.push(`export { JSONViewer } from './${fileName}';`)
				continue
			}

			const componentExports = await extractComponentExports(filePath)

			if (componentExports.length > 0) {
				// Use the actual exports from the file
				componentExports.forEach((exportName) => {
					exports.push(
						`export { ${exportName} } from './${fileName}';`
					)
				})
			} else {
				// Fallback to file name based export if no exports found

				// Convert kebab-case to PascalCase for the component name
				if (fileName.includes('-')) {
					const componentName = fileName
						.split('-')
						.map(
							(part) =>
								part.charAt(0).toUpperCase() + part.slice(1)
						)
						.join('')

					// Special case for UI components that typically use PascalCase
					if (dir.includes('/ui/')) {
						exports.push(
							`export { ${componentName} } from './${fileName}';`
						)
					} else {
						exports.push(
							`export { ${componentName} } from './${fileName}';`
						)
					}
				} else {
					// For non-kebab files, just capitalize the first letter for components
					if (dir.includes('/components/')) {
						const componentName =
							fileName.charAt(0).toUpperCase() + fileName.slice(1)
						exports.push(
							`export { ${componentName} } from './${fileName}';`
						)
					} else {
						exports.push(
							`export { ${fileName} } from './${fileName}';`
						)
					}
				}
			}
		}

		const exportContent = exports.join('\n')
		const indexPath = path.join(dir, 'index.ts')

		// Check if index file already exists
		let existingContent = ''
		try {
			existingContent = await readFile(indexPath, 'utf8')
		} catch (e) {
			// File doesn't exist, that's fine
		}

		// Only write if content is different
		if (existingContent !== exportContent) {
			await writeFile(indexPath, exportContent)
			console.log(`Generated barrel file for ${dir}`)
		} else {
			console.log(`Barrel file for ${dir} is already up to date`)
		}
	} catch (error) {
		console.error(`Error generating barrel file for ${dir}:`, error)
	}
}

const processDirectory = async (baseDir) => {
	console.log(`Scanning ${baseDir} for directories...`)
	const files = await getFilesInDir(baseDir)

	const directories = files
		.filter((item) => item.isDirectory)
		.map((item) => item.path)

	console.log(`Found ${directories.length} directories to process`)

	for (const dir of directories) {
		await generateBarrelFile(dir)
	}

	// Also process the base directory
	await generateBarrelFile(baseDir)
}

// Main execution
;(async () => {
	try {
		for (const dir of TARGET_DIRS) {
			await processDirectory(dir)
		}
		console.log('Barrel files generation complete!')
	} catch (error) {
		console.error('Error generating barrel files:', error)
		process.exit(1)
	}
})()
