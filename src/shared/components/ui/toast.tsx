'use client';

import { For } from '@/components/core/for';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X } from 'lucide-react';
import { create } from 'zustand';

type ToastType = 'success' | 'info' | 'error' | 'action';

interface Toast {
	id: string;
	message: string;
	type: ToastType;
	action?: {
		label: string;
		onClick: () => void;
	};
}

interface ToastStore {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, 'id'>) => void;
	removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
	toasts: [],
	addToast: (toast) =>
		set((state) => ({
			toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).slice(2) }],
		})),
	removeToast: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((t) => t.id !== id),
		})),
}));

const ToastIcon = ({ type }: { type: ToastType }) => {
	switch (type) {
		case 'success':
			return <Check className="h-4 w-4 text-emerald-500/80" />;
		case 'info':
			return <Info className="h-4 w-4 text-muted-foreground" />;
		case 'error':
			return <X className="h-4 w-4 text-destructive" />;
		case 'action':
			return <Info className="h-4 w-4 text-muted-foreground" />;
	}
};

export function ToastContainer() {
	const { toasts, removeToast } = useToastStore();

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
			<AnimatePresence>
				<For
					each={toasts}
					children={(toast) => (
						<motion.div
							key={toast.id}
							initial={{ opacity: 0, y: 20, scale: 0.9 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 20, scale: 0.9 }}
							className="flex items-center gap-2 rounded-lg bg-muted/90 p-4 shadow-lg backdrop-blur-sm"
						>
							<ToastIcon type={toast.type} />
							<p className="text-sm text-muted-foreground">{toast.message}</p>
							{toast.action && (
								<button
									type="button"
									onClick={toast.action.onClick}
									className="ml-2 text-sm font-medium text-primary hover:text-primary/80"
								>
									{toast.action.label}
								</button>
							)}
							<button
								type="button"
								onClick={() => removeToast(toast.id)}
								className="ml-2 rounded-md p-1 hover:bg-muted-foreground/10"
							>
								<X className="h-4 w-4 text-muted-foreground/70" />
							</button>
						</motion.div>
					)}
				/>
			</AnimatePresence>
		</div>
	);
}

// Global toast API
export const toast = (message: string) => {
	return {
		success: () => {
			useToastStore.getState().addToast({ message, type: 'success' });
		},
		error: () => {
			useToastStore.getState().addToast({ message, type: 'error' });
		},
		info: () => {
			useToastStore.getState().addToast({ message, type: 'info' });
		},
		action: (label: string, onClick: () => void) => {
			useToastStore.getState().addToast({
				message,
				type: 'action',
				action: { label, onClick },
			});
		},
	};
};
