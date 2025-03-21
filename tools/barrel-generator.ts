import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

interface FileItem {
	path: string
	isDirectory: boolean
}

// Config
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

// Helper functions
const isDirectory = async (filePath: string): Promise<boolean> => {
	try {
		const stats = await stat(filePath)
		return stats.isDirectory()
	} catch {
		return false
	}
}

const getFilesInDir = async (dir: string): Promise<FileItem[]> => {
	try {
		const items = await readdir(dir)
		const results: FileItem[] = []

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

const generateBarrelFile = async (dir: string): Promise<void> => {
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

		// Generate optimized exports
		const exports = exportableItems
			.map((file) => {
				const fileName = path.basename(file, path.extname(file))
				// For kebab-case files, we need to extract the component name from the file
				// This assumes the component is exported with PascalCase in the file
				if (fileName.includes('-')) {
					// Convert kebab-case to PascalCase for the component name
					const componentName = fileName
						.split('-')
						.map(
							(part) =>
								part.charAt(0).toUpperCase() + part.slice(1)
						)
						.join('')

					return `export { ${componentName} } from './${fileName}'`
				}
				return `export { ${fileName} } from './${fileName}'`
			})
			.join('\n')

		const indexPath = path.join(dir, 'index.ts')

		// Check if index file already exists
		let existingContent = ''
		try {
			existingContent = await readFile(indexPath, 'utf8')
		} catch {
			// File doesn't exist, that's fine
		}

		// Only write if content is different
		if (existingContent !== exports) {
			await writeFile(indexPath, exports)
			console.log(`Generated barrel file for ${dir}`)
		} else {
			console.log(`Barrel file for ${dir} is already up to date`)
		}
	} catch (error) {
		console.error(`Error generating barrel file for ${dir}:`, error)
	}
}

const processDirectory = async (baseDir: string): Promise<void> => {
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
