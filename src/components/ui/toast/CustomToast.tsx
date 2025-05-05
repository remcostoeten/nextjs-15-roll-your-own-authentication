import { toast, ToastOptions } from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

interface CustomToastProps {
  message: string;
  type: 'success' | 'error';
}

const toastStyles = {
  success: {
    style: {
      background: '#10B981',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    icon: <CheckCircle className="w-5 h-5" />,
    className: 'animate-enter',
  },
  error: {
    style: {
      background: '#EF4444',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    icon: <XCircle className="w-5 h-5" />,
    className: 'animate-enter',
  },
};

export const showToast = ({ message, type }: CustomToastProps) => {
  const options: ToastOptions = {
    duration: 4000,
    position: 'top-right',
    ...toastStyles[type],
  };

  toast.custom(
    <div className={`flex items-center space-x-2 ${toastStyles[type].className}`} style={toastStyles[type].style}>
      {toastStyles[type].icon}
      <span>{message}</span>
    </div>,
    options
  );
};
