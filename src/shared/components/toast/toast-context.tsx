'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastState } from './types';

const ToastContext = createContext<ToastState | null>(null);

export function useToastContext() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToastContext must be used within ToastProvider');
	}
	return context;
}

type TProps = {
	children: ReactNode;
};

export function ToastProvider({ children }: TProps) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = (toast: Omit<Toast, 'id' | 'timestamp'>) => {
		const id = Math.random().toString(36).substr(2, 9);
		const newToast: Toast = {
			...toast,
			id,
			timestamp: Date.now(),
			duration: toast.duration || 5000,
		};

		setToasts((prev) => [newToast, ...prev]);

		setTimeout(() => {
			removeToast(id);
		}, newToast.duration);
	};

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
		</ToastContext.Provider>
	);
}
