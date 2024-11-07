'use client'

export function trackEvent(eventName: string, data?: Record<string, any>) {
	fetch('/api/analytics/event', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			eventName,
			data: {
				...data,
				url: window.location.href,
				timestamp: new Date().toISOString()
			}
		})
	})
}

// Usage examples:
// trackEvent('button_click', { buttonId: 'signup' })
// trackEvent('form_submit', { formType: 'contact' })
// trackEvent('video_play', { videoId: '123', duration: 120 })
