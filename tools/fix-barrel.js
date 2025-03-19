#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// Fix specific barrel files with known casing issues
const KNOWN_FIXES = {
	// Add cases where the export name differs from what might be expected
	// Format: 'path/to/file': { 'wrongExport': 'correctExport' }
	'src/shared/components/json-viewer': { JsonViewer: 'JSONViewer' },
	// Add more as needed
}

async function fixBarrelFile(filePath) {
	try {
		if (!filePath) {
			console.error('Please provide a path to the barrel file to fix.')
			process.exit(1)
		}

		// Get directory of the barrel file
		const dir = path.dirname(filePath)

		// Read the current barrel file
		let content
		try {
			content = await readFile(filePath, 'utf8')
		} catch (err) {
			console.error(`Error reading file ${filePath}:`, err)
			process.exit(1)
		}

		// Apply known fixes
		let fixedContent = content

		// Process each line
		const lines = content.split('\n')
		const fixedLines = lines.map((line) => {
			// Check if this line is an export
			if (!line.trim().startsWith('export {')) {
				return line
			}

			// Extract the file path from the export line
			const importMatch = line.match(/from\s+['"](.+)['"]/)
			if (!importMatch || !importMatch[1]) {
				return line
			}

			const importPath = importMatch[1].replace(/^\.\//, '') // Remove leading ./

			// Check if we have known fixes for this import
			const fixes = KNOWN_FIXES[path.join(dir, importPath)]
			if (!fixes) {
				return line
			}

			// Apply the fixes
			let fixedLine = line
			for (const [wrong, correct] of Object.entries(fixes)) {
				// Replace the wrong export with the correct one
				const exportRegex = new RegExp(`{\\s*${wrong}\\s*}`, 'g')
				fixedLine = fixedLine.replace(exportRegex, `{ ${correct} }`)
			}

			return fixedLine
		})

		fixedContent = fixedLines.join('\n')

		// Write the fixed content back
		if (content !== fixedContent) {
			await writeFile(filePath, fixedContent)
			console.log(`Fixed barrel file: ${filePath}`)
		} else {
			console.log(`No fixes needed for: ${filePath}`)
		}
	} catch (error) {
		console.error('Error fixing barrel file:', error)
		process.exit(1)
	}
}

const targetFile = process.argv[2]
fixBarrelFile(targetFile)
