let pageStartTime = 0;
let maxScrollDepth = 0;

export function startPageTracking(): void {
	if (typeof window === 'undefined') return;

	pageStartTime = Date.now();
	maxScrollDepth = 0;

	function updateScrollDepth() {
		const scrollTop = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		const scrollDepth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
		maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
	}

	let scrollTimeout: number;
	function handleScroll() {
		clearTimeout(scrollTimeout);
		scrollTimeout = window.setTimeout(updateScrollDepth, 100);
	}

	window.addEventListener('scroll', handleScroll, { passive: true });

	const cleanup = () => {
		window.removeEventListener('scroll', handleScroll);
	};

	window.addEventListener('beforeunload', cleanup);
	window.addEventListener('pagehide', cleanup);
}

export function getPageMetrics(): { duration: number; scrollDepth: number } {
	return {
		duration: pageStartTime > 0 ? Date.now() - pageStartTime : 0,
		scrollDepth: maxScrollDepth,
	};
}
