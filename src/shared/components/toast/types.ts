export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
	timestamp: number;
}

export interface ToastState {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void;
	removeToast: (id: string) => void;
}
