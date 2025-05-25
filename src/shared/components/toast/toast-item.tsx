import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToastContext } from './toast-context';
import { Toast } from './types';

type TProps = {
	toast: Toast;
	index: number;
	isHovered: boolean;
};

export function ToastItem({ toast, index, isHovered }: TProps) {
	const { removeToast } = useToastContext();
	const [isVisible, setIsVisible] = useState(false);
	const [isExiting, setIsExiting] = useState(false);

	useEffect(() => {
		// Trigger enter animation
		const timer = setTimeout(() => setIsVisible(true), 50);
		return () => clearTimeout(timer);
	}, []);

	const handleClose = () => {
		setIsExiting(true);
		setTimeout(() => removeToast(toast.id), 200);
	};

	const getIcon = () => {
		switch (toast.type) {
			case 'success':
				return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
			case 'error':
				return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
			case 'warning':
				return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
			case 'info':
				return <Info className="w-3.5 h-3.5 text-blue-400" />;
			default:
				return <div className="w-3.5 h-3.5 rounded-full bg-slate-400" />;
		}
	};

	const getTypeStyles = () => {
		switch (toast.type) {
			case 'success':
				return 'border-emerald-500/10 bg-emerald-500/5';
			case 'error':
				return 'border-red-500/10 bg-red-500/5';
			case 'warning':
				return 'border-amber-500/10 bg-amber-500/5';
			case 'info':
				return 'border-blue-500/10 bg-blue-500/5';
			default:
				return 'border-slate-500/10 bg-slate-500/5';
		}
	};

	const stackOffset = isHovered ? 0 : index * 6;
	const stackScale = isHovered ? 1 : Math.max(0.98, 1 - index * 0.015);
	const stackOpacity = isHovered ? 1 : Math.max(0.6, 1 - index * 0.15);

	return (
		<div
			className={`
        fixed right-4
        bg-black/90 backdrop-blur-xl
        border ${getTypeStyles()}
        rounded-lg shadow-2xl
        min-w-[280px] max-w-[300px] p-2.5
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        hover:scale-[1.01] cursor-pointer group
        relative overflow-hidden
      `}
			style={{
				top: `${16 + stackOffset}px`,
				transform: `translateX(${isVisible && !isExiting ? 0 : 100}%) scale(${stackScale})`,
				opacity: stackOpacity,
				zIndex: 1000 - index,
				filter: `blur(${isHovered ? 0 : index * 0.2}px)`,
			}}
			onClick={handleClose}
		>
			<div className="flex items-center gap-2.5 relative z-10">
				<div className="shrink-0">{getIcon()}</div>
				<div className="flex-1 min-w-0">
					<div className="text-white text-xs font-medium leading-snug">
						{toast.message}
					</div>
				</div>
				<button
					onClick={(e) => {
						e.stopPropagation();
						handleClose();
					}}
					className="shrink-0 text-white/40 hover:text-white/70
                     transition-colors duration-200 p-0.5 -m-0.5 rounded
                     hover:bg-background bbb/5"
				>
					<X className="w-3 h-3" />
				</button>
			</div>

			{/* Subtle fade effect instead of progress bar */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 100%)',
					animation: `subtle-fade ${toast.duration || 5000}ms ease-out forwards`,
				}}
			/>
		</div>
	);
}
