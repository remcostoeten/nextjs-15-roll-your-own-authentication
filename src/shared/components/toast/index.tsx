'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

interface ToastContextValue {
	toasts: Toast[];
	addToast: (message: string, type: ToastType, duration?: number) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToastContext() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
}

// Create a singleton for toast functions
let toastFns: {
	success: (message: string, duration?: number) => void;
	error: (message: string, duration?: number) => void;
	warning: (message: string, duration?: number) => void;
	info: (message: string, duration?: number) => void;
	neutral: (message: string, duration?: number) => void;
} | null = null;

// Hook to initialize toast functions
export function useInitializeToast() {
	const { addToast } = useToastContext();

	if (!toastFns) {
		toastFns = {
			success: (message: string, duration?: number) => addToast(message, 'success', duration),
			error: (message: string, duration?: number) => addToast(message, 'error', duration),
			warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
			info: (message: string, duration?: number) => addToast(message, 'info', duration),
			neutral: (message: string, duration?: number) => addToast(message, 'neutral', duration),
		};
	}
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onRemove();
		}, toast.duration || 3000);

		return () => clearTimeout(timer);
	}, [toast.duration, onRemove]);

	const baseClasses = 'rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out';
	const typeClasses = {
		success: 'bg-green-500 text-white',
		error: 'bg-red-500 text-white',
		warning: 'bg-yellow-500 text-white',
		info: 'bg-blue-500 text-white',
		neutral: 'bg-gray-700 text-white',
	};

	return (
		<div
			className={`${baseClasses} ${typeClasses[toast.type]} animate-slide-in`}
			onClick={onRemove}
			role="alert"
		>
			{toast.message}
		</div>
	);
}

function ClientOnlyPortal({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return createPortal(children, document.body);
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
	return (
		<ClientOnlyPortal>
			<div className="fixed top-4 right-4 z-50 space-y-4">
				{toasts.map((toast) => (
					<ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
				))}
			</div>
		</ClientOnlyPortal>
	);
}

// Internal component to initialize toast functions
function ToastInitializer() {
	useInitializeToast();
	return null;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((message: string, type: ToastType = 'neutral', duration = 3000) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prev) => [...prev, { id, message, type, duration }]);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			<ToastInitializer />
			{children}
			<ToastContainer toasts={toasts} removeToast={removeToast} />
		</ToastContext.Provider>
	);
}

// Export the toast functions
export const toast = {
	success: (message: string, duration?: number) => {
		if (!toastFns) {
			console.error('Toast system not initialized');
			return;
		}
		toastFns.success(message, duration);
	},
	error: (message: string, duration?: number) => {
		if (!toastFns) {
			console.error('Toast system not initialized');
			return;
		}
		toastFns.error(message, duration);
	},
	warning: (message: string, duration?: number) => {
		if (!toastFns) {
			console.error('Toast system not initialized');
			return;
		}
		toastFns.warning(message, duration);
	},
	info: (message: string, duration?: number) => {
		if (!toastFns) {
			console.error('Toast system not initialized');
			return;
		}
		toastFns.info(message, duration);
	},
	neutral: (message: string, duration?: number) => {
		if (!toastFns) {
			console.error('Toast system not initialized');
			return;
		}
		toastFns.neutral(message, duration);
	},
};
