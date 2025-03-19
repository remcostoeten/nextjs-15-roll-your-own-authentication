type DevToolsConfig = {
	enabled: boolean
	allowDrag: boolean
	showInProduction: boolean
}

// Default configuration
export const devToolsConfig: DevToolsConfig = {
	enabled: true,
	allowDrag: true,
	showInProduction: true, // Always show in production
}
