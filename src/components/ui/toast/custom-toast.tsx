import { toast, ToastOptions } from 'react-hot-toast';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface CustomToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  description?: string;
}

const toastStyles = {
  success: {
    style: {
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(8px)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid rgba(68, 68, 68, 0.3)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      minWidth: '300px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    className: 'animate-toast-enter',
  },
  error: {
    style: {
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(8px)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid rgba(68, 68, 68, 0.3)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      minWidth: '300px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    className: 'animate-toast-enter',
  },
  info: {
    style: {
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(8px)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid rgba(68, 68, 68, 0.3)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      minWidth: '300px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    icon: <Info className="w-5 h-5 text-blue-500" />,
    className: 'animate-toast-enter',
  },
};

export const showToast = ({ message, type, description }: CustomToastProps) => {
  const options: ToastOptions = {
    duration: 4000,
    position: 'bottom-right',
    ...toastStyles[type],
  };

  toast.custom(
    <div 
      className={`flex items-start space-x-3 ${toastStyles[type].className}`} 
      style={toastStyles[type].style}
    >
      <div className="shrink-0 pt-0.5">
        {toastStyles[type].icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        )}
      </div>
    </div>,
    options
  );
};
