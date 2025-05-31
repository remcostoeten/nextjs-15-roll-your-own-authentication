export function getVisitorId(): string {
	if (typeof window === 'undefined') return '';

	const storageKey = '_ryo_visitor_id';
	let visitorId = localStorage.getItem(storageKey);

	if (!visitorId) {
		visitorId = crypto.randomUUID();
		localStorage.setItem(storageKey, visitorId);
	}

	return visitorId;
}

export function getSessionId(): string {
	if (typeof window === 'undefined') return '';

	const storageKey = '_ryo_session_id';
	const sessionTimeout = 30 * 60 * 1000; // 30 minutes

	const stored = sessionStorage.getItem(storageKey);
	if (stored) {
		const { id, timestamp } = JSON.parse(stored);
		if (Date.now() - timestamp < sessionTimeout) {
			return id;
		}
	}

	const sessionId = crypto.randomUUID();
	sessionStorage.setItem(
		storageKey,
		JSON.stringify({
			id: sessionId,
			timestamp: Date.now(),
		})
	);

	return sessionId;
}

export function updateSessionTimestamp(): void {
	if (typeof window === 'undefined') return;

	const storageKey = '_ryo_session_id';
	const stored = sessionStorage.getItem(storageKey);

	if (stored) {
		const { id } = JSON.parse(stored);
		sessionStorage.setItem(
			storageKey,
			JSON.stringify({
				id,
				timestamp: Date.now(),
			})
		);
	}
}
