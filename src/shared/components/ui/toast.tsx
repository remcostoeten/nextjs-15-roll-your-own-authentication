import { CheckCircle, Info, Loader2, X, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { toast as hotToast } from 'react-hot-toast';
import { cn } from 'utilities';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface ToastProps {
	message: string;
	description?: string;
	type?: ToastType;
	duration?: number;
}

const toastStyles = {
	base: 'group flex items-start gap-2.5 rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur-lg transition-all duration-200 hover:bg-background/98 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full min-w-[400px] max-w-[800px] w-auto',
	success: 'border-emerald-200/10 bg-emerald-500/5',
	error: 'border-red-200/10 bg-red-500/5',
	info: 'border-blue-200/10 bg-blue-500/5',
	loading: 'border-gray-200/10 bg-gray-500/5',
};

const iconStyles = {
	success: 'text-emerald-500',
	error: 'text-red-500',
	info: 'text-blue-500',
	loading: 'text-gray-500',
};

const icons: Record<ToastType, ReactNode> = {
	success: <CheckCircle className="h-4 w-4" />,
	error: <XCircle className="h-4 w-4" />,
	info: <Info className="h-4 w-4" />,
	loading: <Loader2 className="h-4 w-4 animate-spin" />,
};

export function toast({ message, description, type = 'info', duration = 4000 }: ToastProps) {
	return hotToast.custom(
		({ visible }) => (
			<div
				className={cn(
					toastStyles.base,
					toastStyles[type],
					'relative',
					visible ? 'animate-enter' : 'animate-leave'
				)}
			>
				<div className={cn('shrink-0', iconStyles[type])}>{icons[type]}</div>
				<div className="flex-1 space-y-0.5">
					<p className="text-sm font-medium text-foreground leading-tight">{message}</p>
					{description && (
						<p className="text-xs text-muted-foreground/80 leading-tight">
							{description}
						</p>
					)}
				</div>
				<button
					onClick={() => hotToast.dismiss()}
					className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
				>
					<X className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground" />
				</button>
			</div>
		),
		{
			duration: type === 'loading' ? Number.POSITIVE_INFINITY : duration,
			position: 'bottom-right',
		}
	);
}

// Convenience methods
toast.success = (message: string, description?: string, duration?: number) =>
	toast({ message, description, type: 'success', duration });

toast.error = (message: string, description?: string, duration?: number) =>
	toast({ message, description, type: 'error', duration });

toast.info = (message: string, description?: string, duration?: number) =>
	toast({ message, description, type: 'info', duration });

toast.loading = (message: string, description?: string) =>
	toast({ message, description, type: 'loading' });

// Method to dismiss all toasts
toast.dismiss = hotToast.dismiss;
