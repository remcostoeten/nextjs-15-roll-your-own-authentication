'use client';

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from './toast';

export function ToastProvider() {
	useEffect(() => {
		let toastContainer = document.getElementById('toast-root');

		if (!toastContainer) {
			toastContainer = document.createElement('div');
			toastContainer.id = 'toast-root';
			document.body.appendChild(toastContainer);
			createRoot(toastContainer).render(<ToastContainer />);
		}
	}, []);

	return null;
}
