export function setupEventListeners(
	trackEvent: (type: string, data?: Record<string, any>) => void
): () => void {
	if (typeof window === 'undefined') return () => {};

	const cleanupFunctions: (() => void)[] = [];

	function handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target) return;

		const tagName = target.tagName.toLowerCase();
		const data: Record<string, any> = {
			tagName,
			x: event.clientX,
			y: event.clientY,
		};

		if (target.id) data.id = target.id;
		if (target.className) data.className = target.className;
		if (tagName === 'a') data.href = (target as HTMLAnchorElement).href;
		if (tagName === 'button') data.buttonText = target.textContent?.trim();
		if (target.dataset) data.dataset = target.dataset;

		trackEvent('click', data);
	}

	function handleFormSubmit(event: SubmitEvent) {
		const form = event.target as HTMLFormElement;
		if (!form) return;

		const data: Record<string, any> = {
			formId: form.id,
			formName: form.name,
			action: form.action,
			method: form.method,
			formData: new FormData(form),
		};

		trackEvent('form_submit', data);
	}

	function handleError(event: ErrorEvent) {
		const data = {
			message: event.message,
			filename: event.filename,
			lineno: event.lineno,
			colno: event.colno,
			stack: event.error?.stack,
		};

		trackEvent('error', data);
	}

	function handleUnhandledRejection(event: PromiseRejectionEvent) {
		const data = {
			reason: event.reason,
			stack: event.reason?.stack,
		};

		trackEvent('error', data);
	}

	document.addEventListener('click', handleClick, true);
	document.addEventListener('submit', handleFormSubmit, true);
	window.addEventListener('error', handleError);
	window.addEventListener('unhandledrejection', handleUnhandledRejection);

	cleanupFunctions.push(() => {
		document.removeEventListener('click', handleClick, true);
		document.removeEventListener('submit', handleFormSubmit, true);
		window.removeEventListener('error', handleError);
		window.removeEventListener('unhandledrejection', handleUnhandledRejection);
	});

	return () => {
		cleanupFunctions.forEach((cleanup) => cleanup());
	};
}
