export function setupErrorTracking() {
	if (typeof window !== 'undefined') {
		window.onerror = (msg, url, lineNo, columnNo, error) => {
			fetch('/api/analytics/error', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: msg,
					source: url,
					lineNo,
					columnNo,
					error: error?.stack,
					userAgent: navigator.userAgent,
					timestamp: new Date().toISOString()
				})
			})
		}
	}
}
