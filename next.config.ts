const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: true,
})

// Load original config if it exists
let originalConfig = {}
try {
	const originalConfigPath = './next.config.js.bak'
	if (require('fs').existsSync(originalConfigPath)) {
		const originalModule = require(originalConfigPath)
		originalConfig =
			typeof originalModule === 'function'
				? originalModule()
				: originalModule
	}
} catch (e) {
	console.warn('Could not load original config, using defaults')
}

module.exports = withBundleAnalyzer(originalConfig)
